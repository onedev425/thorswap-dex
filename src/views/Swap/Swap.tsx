import { useCallback, useMemo, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Amount,
  Asset,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'
import { TS_AGGREGATOR_PROXY_ADDRESS } from 'config/constants'
import uniq from 'lodash/uniq'

import { FeeModal } from 'views/Swap/FeeModal'
import { RouteFee } from 'views/Swap/types'

import { PanelView } from 'components/PanelView'
import { SwapRouter } from 'components/SwapRouter'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useBalance } from 'hooks/useBalance'
import { useSlippage } from 'hooks/useSlippage'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { useFormatPrice } from 'helpers/formatPrice'

import { getSwapRoute } from 'settings/constants'

import { ApproveModal } from './ApproveModal'
import { AssetInputs } from './AssetInputs'
import { ConfirmSwapModal } from './ConfirmSwapModal'
import { CustomRecipientInput } from './CustomRecipientInput'
import { useIsAssetApproved } from './hooks/useIsAssetApproved'
import { gasFeeMultiplier, useSwap } from './hooks/useSwap'
import { useSwapApprove } from './hooks/useSwapApprove'
import { useSwapPair } from './hooks/useSwapPair'
import { useSwapQuote } from './hooks/useSwapQuote'
import { useSwapTokenPrices } from './hooks/useSwapTokenPrices'
import { SwapHeader } from './SwapHeader'
import { SwapInfo } from './SwapInfo'
import { SwapSubmitButton } from './SwapSubmitButton'

const SwapView = () => {
  const navigate = useNavigate()
  const { feeOptionType } = useApp()
  const { getMaxBalance } = useBalance()
  const { inputAmount, setInputAmount, inputAsset, outputAsset } = useSwapPair()
  const { wallet } = useWallet()
  const { pools } = useMidgard()

  const ethPrice = useMemo(
    () =>
      pools.find(
        ({ asset }) => asset.type === 'Native' && asset.ticker === 'ETH',
      )?.assetUSDPrice || 0,
    [pools],
  )

  const formatPrice = useFormatPrice({ groupSize: 0 })

  const [gasPrice, setGasPrice] = useState<number>()
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)
  const [feeModalOpened, setFeeModalOpened] = useState(false)

  useEffect(() => {
    const address = multichain().getWalletAddressByChain(outputAsset.L1Chain)
    setRecipient(address || '')
  }, [outputAsset, wallet])

  const senderAddress = useMemo(
    () => multichain().getWalletAddressByChain(inputAsset.L1Chain) || '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputAsset, wallet],
  )

  const {
    routes,
    refetch: refetchQuote,
    quoteMode,
    outputAmount,
    selectedRoute,
    setSwapRoute,
    isFetching,
    minReceive,
  } = useSwapQuote({
    inputAmount,
    inputAsset,
    outputAsset,
    senderAddress,
    recipientAddress: recipient,
  })

  const {
    prices: { inputUSDPrice, outputUSDPrice },
    isLoading: isPriceLoading,
    refetch: refetchPrice,
  } = useSwapTokenPrices({ inputAmount, inputAsset, outputAmount, outputAsset })

  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const maxInputBalance = useMemo(
    () => getMaxBalance(inputAsset),
    [inputAsset, getMaxBalance],
  )

  const inputAssetBalance = useMemo(
    () => (isInputWalletConnected ? maxInputBalance : undefined),
    [isInputWalletConnected, maxInputBalance],
  )

  const inputAssetProps = useMemo(
    () => ({
      asset: inputAsset,
      value: inputAmount,
      balance: inputAssetBalance,
      usdPrice: inputUSDPrice,
      priceLoading: isPriceLoading,
    }),
    [inputAsset, inputAmount, inputAssetBalance, inputUSDPrice, isPriceLoading],
  )

  const outputAssetProps = useMemo(
    () => ({
      asset: outputAsset,
      value: outputAmount,
      usdPrice: outputUSDPrice,
      loading: isFetching,
      priceLoading: isPriceLoading || isFetching,
    }),
    [outputAsset, outputAmount, outputUSDPrice, isFetching, isPriceLoading],
  )

  const contract = useMemo(
    () =>
      (quoteMode === QuoteMode.ETH_TO_ETH && selectedRoute?.contract) ||
      TS_AGGREGATOR_PROXY_ADDRESS,
    [quoteMode, selectedRoute?.contract],
  )

  const {
    isApproved,
    assetApproveStatus,
    isLoading: isApproveAssetLoading,
  } = useIsAssetApproved({ asset: inputAsset, contract, quoteMode })

  useEffect(() => {
    if (ethPrice) {
      multichain()
        .eth.getClient()
        .estimateGasPricesFromEtherscan()
        .then(({ average }) => {
          const gasFee = new Amount(average.amount(), 0, average.decimal)
          const gasPrice = gasFee
            .mul(ethPrice)
            .mul(10 ** 5)
            // @ts-expect-error multichain-sdk
            .toSignificantBigNumber()
            .toNumber()

          setGasPrice(gasPrice)
        })
    }
  }, [ethPrice])

  // @ts-expect-error cross-chain-api-sdk
  const routeFees: RouteFee | undefined = selectedRoute?.fees

  const { affiliateFee, networkFee, totalFee } = useMemo(() => {
    if (!isApproved && gasPrice) {
      const price = gasPrice * gasFeeMultiplier[feeOptionType]
      return { affiliateFee: 0, networkFee: price, totalFee: price }
    }

    const feesData = Object.values(routeFees || {}).flat()

    const emptyFees = { affiliateFee: 0, networkFee: 0, totalFee: 0 }
    if (feesData.length === 0) return emptyFees

    const fees = feesData.reduce((acc, fee) => {
      acc.affiliateFee += fee.affiliateFeeUSD
      acc.networkFee += fee.networkFeeUSD

      return acc
    }, emptyFees)

    return {
      affiliateFee: fees.affiliateFee,
      networkFee: fees.networkFee,
      totalFee: fees.affiliateFee + fees.networkFee,
    }
  }, [feeOptionType, gasPrice, isApproved, routeFees])

  const feeAssets = useMemo(
    () =>
      uniq(
        Object.values(routeFees || {})
          .flat()
          .map(({ asset }) => asset.split('.')[1]),
      ).join(', '),
    [routeFees],
  )

  const handleSelectAsset = useCallback(
    (type: 'input' | 'output') => (asset: Asset) => {
      const isInput = type === 'input'
      const input = !isInput
        ? asset.eq(inputAsset)
          ? outputAsset
          : inputAsset
        : asset
      const output = isInput
        ? asset.eq(outputAsset)
          ? inputAsset
          : outputAsset
        : asset

      if (isInput) {
        const maxNewInputBalance = getMaxBalance(asset)
        setInputAmount(
          inputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : inputAmount,
        )
      }

      navigate(getSwapRoute(input, output))
    },
    [
      getMaxBalance,
      inputAmount,
      inputAsset,
      navigate,
      outputAsset,
      setInputAmount,
    ],
  )

  const handleSwitchPair = useCallback(() => {
    const maxNewInputBalance = getMaxBalance(outputAsset)
    setInputAmount(
      outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount,
    )

    navigate(getSwapRoute(outputAsset, inputAsset))
  }, [
    getMaxBalance,
    outputAsset,
    setInputAmount,
    outputAmount,
    navigate,
    inputAsset,
  ])

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      setInputAmount(
        isApproved
          ? amount.gt(maxInputBalance)
            ? maxInputBalance
            : amount
          : amount,
      )
    },
    [isApproved, maxInputBalance, setInputAmount],
  )

  const refetchData = useCallback(() => {
    refetchPrice()
    refetchQuote()
  }, [refetchPrice, refetchQuote])

  const handleSwap = useSwap({
    inputAmount,
    inputAsset,
    outputAmount,
    outputAsset,
    quoteMode,
    recipient,
    route: selectedRoute,
  })

  const handleApprove = useSwapApprove({
    contract,
    inputAsset,
    quoteMode,
  })
  const slippage = useSlippage(inputUSDPrice, outputUSDPrice)

  const minReceiveSlippage = useSlippage(
    inputUSDPrice,
    formatPrice(minReceive.mul(outputUSDPrice.unitPrice), { prefix: '' }),
  )

  const minReceiveInfo = useMemo(
    () =>
      minReceive.gte(0)
        ? `${minReceive.toSignificant(6)} ${outputAsset.name.toUpperCase()}`
        : '-',
    [minReceive, outputAsset.name],
  )

  const isOutputWalletConnected = useMemo(
    () =>
      outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  )

  return (
    <PanelView
      title={`${t('common.swap')} ${inputAsset.name} >> ${outputAsset.name}`}
      header={
        <SwapHeader
          isLoading={isFetching || isPriceLoading}
          refetchData={refetchData}
          asset={inputAsset.isRUNE() ? outputAsset : inputAsset}
        />
      }
    >
      <AssetInputs
        inputAsset={inputAssetProps}
        onInputAmountChange={handleChangeInputAmount}
        onInputAssetChange={handleSelectAsset('input')}
        onOutputAssetChange={handleSelectAsset('output')}
        onSwitchPair={handleSwitchPair}
        outputAsset={outputAssetProps}
      />

      <CustomRecipientInput
        isOutputWalletConnected={isOutputWalletConnected}
        outputAssetL1Chain={outputAsset.L1Chain}
        recipient={recipient}
        setRecipient={setRecipient}
      />

      <SwapInfo
        expectedOutput={`${outputAmount?.toSignificant(
          6,
        )} ${outputAsset.name.toUpperCase()}`}
        setFeeModalOpened={setFeeModalOpened}
        inputUSDPrice={inputUSDPrice}
        affiliateFee={affiliateFee}
        networkFee={networkFee}
        gasPrice={gasPrice}
        isLoading={isPriceLoading}
        minReceive={minReceiveInfo}
        minReceiveSlippage={minReceiveSlippage}
        outputUSDPrice={outputUSDPrice}
      />

      <SwapRouter
        inputAsset={inputAsset}
        slippage={slippage}
        selectedRoute={selectedRoute}
        setSwapRoute={setSwapRoute}
        outputAsset={outputAsset}
        quoteMode={quoteMode}
        outputUSDPrice={outputUSDPrice}
        routes={routes}
      />

      <SwapSubmitButton
        assetApproveStatus={assetApproveStatus}
        hasQuote={!!selectedRoute}
        inputAmount={inputAmount}
        inputAsset={inputAsset}
        isApproved={isApproved}
        isInputWalletConnected={isInputWalletConnected}
        isLoading={isFetching || isPriceLoading || isApproveAssetLoading}
        outputAsset={outputAsset}
        recipient={recipient}
        setVisibleApproveModal={setVisibleApproveModal}
        setVisibleConfirmModal={setVisibleConfirmModal}
        slippage={slippage}
        swapAmountTooSmall={inputUSDPrice.price.lte(totalFee)}
      />

      <ConfirmSwapModal
        affiliateFee={formatPrice(affiliateFee)}
        feeAssets={feeAssets}
        handleSwap={handleSwap}
        inputAmount={inputAmount}
        inputAssetProps={inputAssetProps}
        minReceive={minReceiveInfo}
        outputAssetProps={outputAssetProps}
        recipient={recipient}
        setVisible={setVisibleConfirmModal}
        slippageInfo={slippage.toFixed(3)}
        totalFee={formatPrice(totalFee)}
        visible={visibleConfirmModal}
      />

      <ApproveModal
        handleApprove={handleApprove}
        inputAmount={inputAmount}
        inputAsset={inputAsset}
        setVisible={setVisibleApproveModal}
        totalFee={formatPrice(totalFee)}
        visible={visibleApproveModal}
      />

      <FeeModal
        fees={routeFees}
        totalFee={formatPrice(totalFee)}
        isOpened={feeModalOpened}
        onClose={() => setFeeModalOpened(false)}
      />
    </PanelView>
  )
}

export default SwapView
