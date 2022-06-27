import { useCallback, useMemo, useEffect, useState, ChangeEvent } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import {
  Amount,
  Asset,
  getWalletAddressByChain,
  Percent,
  Price,
  getEstimatedTxTime,
  SupportedChain,
  hasWalletConnected,
  DEFAULT_AFFILIATE_FEE,
} from '@thorswap-lib/multichain-sdk'
import copy from 'copy-to-clipboard'

import { SwapSubmitButton } from 'views/Swap/SwapSubmitButton'
import { useSwap } from 'views/Swap/useSwap'
import { useSwapAssets } from 'views/Swap/useSwapAssets'

import { Button, Icon, Box, Typography } from 'components/Atomic'
import { CountDownIndicator } from 'components/CountDownIndicator'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTable } from 'components/InfoTable'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems'
import { PanelInput } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { showErrorToast, showInfoToast } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useAddressForTNS } from 'hooks/useAddressForTNS'
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance'
import { useBalance } from 'hooks/useBalance'
import { useNetworkFee } from 'hooks/useNetworkFee'
import { useTxTracker } from 'hooks/useTxTracker'
import { useVthorBalance } from 'hooks/useVthorBalance'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { translateErrorMsg } from 'helpers/error'

import { IS_AFFILIATE_ON } from 'settings/config'
import {
  getPoolDetailRouteFromAsset,
  getSwapRoute,
  navigateToExternalLink,
  POLL_GET_POOLS_INTERVAL,
} from 'settings/constants'

import { AssetInputs } from './AssetInputs'
import { ConfirmContent } from './ConfirmContent'
import { getSwapPair, getSwapTrackerType } from './helpers'
import { SwapInfo } from './SwapInfo'
import { Pair } from './types'

const AFFILIATE_FEE_THRESHOLD_AMOUNT = 100

const SwapView = () => {
  const navigate = useNavigate()
  const { pair } = useParams<{ pair: string }>()

  const [{ inputAsset, outputAsset }, setSwapPair] = useState<Pair>({
    inputAsset: Asset.BTC(),
    outputAsset: Asset.RUNE(),
  })
  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [addressDisabled, setAddressDisabled] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [thorname, setThorname] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)

  const { getMaxBalance } = useBalance()
  const { wallet } = useWallet()
  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet])

  const { hasVThor } = useVthorBalance(ethAddr)

  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()
  const { totalFeeInUSD, feeAssets } = useNetworkFee({
    inputAsset,
    outputAsset,
  })
  const { poolLoading, getPools } = useMidgard()
  const { customRecipientMode } = useApp()

  const { outputAssets, inputAssets, pools } = useSwapAssets()

  const inputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: inputAsset,
        pools,
        priceAmount: inputAmount,
      }),
    [inputAsset, inputAmount, pools],
  )

  const isAffiliated = useMemo(
    () =>
      IS_AFFILIATE_ON &&
      inputAssetPriceInUSD.raw().gte(AFFILIATE_FEE_THRESHOLD_AMOUNT) &&
      !hasVThor,
    [inputAssetPriceInUSD, hasVThor],
  )

  const affiliateFeeInUSD = useMemo(
    () =>
      new Price({
        baseAsset: inputAsset,
        pools,
        priceAmount: inputAmount.mul(
          IS_AFFILIATE_ON ? DEFAULT_AFFILIATE_FEE : 0,
        ),
      }),
    [inputAsset, inputAmount, pools],
  )

  const swap = useSwap({
    poolLoading,
    inputAmount,
    inputAsset,
    pools,
    outputAsset,
    isAffiliated,
  })

  const isValidSlip = useMemo(() => swap?.isSlipValid() ?? true, [swap])

  const { loading, TNS } = useAddressForTNS(recipient)

  useEffect(() => {
    const getPair = async () => {
      if (!pair) return

      const swapPairData = await getSwapPair(pair)

      if (swapPairData) {
        setSwapPair(swapPairData)
      }
    }

    getPair()
  }, [pair])

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.L1Chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  useEffect(() => {
    if (TNS && outputAsset.L1Chain) {
      const TNSAddress = TNS.entries.find(
        ({ chain }) => chain === outputAsset.L1Chain,
      )

      if (TNSAddress) {
        setThorname(TNS.thorname)
        setRecipient(TNSAddress.address)
      }
    }
  }, [TNS, outputAsset.L1Chain])

  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const handleCopyAddress = useCallback(() => {
    copy(recipient)
    showInfoToast(t('notification.addressCopied'))
  }, [recipient])

  const toggleAddressDisabled = useCallback(() => {
    setAddressDisabled(!addressDisabled)
  }, [addressDisabled])

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setRecipient(value)
      setThorname('')
    },
    [],
  )

  const outputAmount: Amount = useMemo(
    () =>
      swap ? swap.outputAmountAfterFee.amount : Amount.fromAssetAmount(0, 8),
    [swap],
  )

  const slipPercent: Percent = useMemo(
    () => (swap ? swap.slip : new Percent(0)),
    [swap],
  )

  const minReceive: Amount = useMemo(
    () => (swap ? swap.minOutputAmount : Amount.fromAssetAmount(0, 8)),
    [swap],
  )

  const outputAssetPriceInUSD = useMemo(
    () =>
      new Price({ baseAsset: outputAsset, pools, priceAmount: outputAmount }),
    [outputAsset, outputAmount, pools],
  )

  const maxInputBalance: Amount = useMemo(
    () => getMaxBalance(inputAsset),
    [inputAsset, getMaxBalance],
  )

  const inputAssetBalance: Amount | undefined = useMemo(
    () => (isInputWalletConnected ? getMaxBalance(inputAsset) : undefined),
    [inputAsset, isInputWalletConnected, getMaxBalance],
  )

  const handleSelectAsset = useCallback(
    (type: 'input' | 'output') => (asset: Asset) => {
      const input =
        type === 'output'
          ? asset.eq(inputAsset)
            ? outputAsset
            : inputAsset
          : asset
      const output =
        type === 'input'
          ? asset.eq(outputAsset)
            ? inputAsset
            : outputAsset
          : asset
      if (type === 'input') {
        const maxNewInputBalance = getMaxBalance(asset)
        setInputAmount(
          inputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : inputAmount,
        )
      }

      navigate(getSwapRoute(input, output))
    },
    [getMaxBalance, inputAmount, inputAsset, navigate, outputAsset],
  )

  const handleSwitchPair = useCallback(() => {
    const maxNewInputBalance = getMaxBalance(outputAsset)
    setInputAmount(
      outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount,
    )
    navigate(getSwapRoute(outputAsset, inputAsset))
  }, [getMaxBalance, outputAsset, navigate, inputAsset, outputAmount])

  const handleChangeInputAmount = useCallback(
    (amount: Amount) =>
      setInputAmount(amount.gt(maxInputBalance) ? maxInputBalance : amount),
    [maxInputBalance],
  )

  const navigateToPoolInfo = useCallback(() => {
    const asset = inputAsset.isRUNE() ? outputAsset : inputAsset

    navigateToExternalLink(getPoolDetailRouteFromAsset(asset))
  }, [inputAsset, outputAsset])

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet && swap) {
      const trackerType = getSwapTrackerType(swap)
      const { inputAsset, inputAmount, outputAsset, outputAmountAfterFee } =
        swap
      const submitTx = {
        inAssets: [
          {
            asset: inputAsset.toString(),
            amount: inputAmount.toSignificant(6),
          },
        ],
        outAssets: [
          {
            asset: outputAsset.toString(),
            amount: outputAmountAfterFee.toSignificant(6),
          },
        ],
      }

      // register to tx tracker
      const trackId = submitTransaction({ type: trackerType, submitTx })

      try {
        const txHash = await multichain.swap({ swap, recipient, isAffiliated })

        // start polling
        pollTransaction({
          type: trackerType,
          uuid: trackId,
          submitTx: { ...submitTx, txID: txHash },
        })
      } catch (error: NotWorth) {
        setTxFailed(trackId)
        const description = translateErrorMsg(error?.toString())
        console.error(error, description)

        showErrorToast(t('notification.submitTxFailed'), description)
      }
    }
  }, [
    wallet,
    swap,
    recipient,
    isAffiliated,
    submitTransaction,
    pollTransaction,
    setTxFailed,
  ])

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false)

    if (isInputWalletConnected) {
      const submitTx = {
        // not needed for approve tx
        inAssets: [{ asset: inputAsset.toString(), amount: '0' }],
      }
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx,
      })

      try {
        const txHash = await multichain.approveAsset(inputAsset)

        if (txHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Approve,
            uuid: trackId,
            submitTx: { ...submitTx, txID: txHash },
          })
        }
      } catch (error) {
        console.error(error)
        setTxFailed(trackId)
        showErrorToast(t('notification.approveFailed'))
      }
    }
  }, [
    inputAsset,
    isInputWalletConnected,
    pollTransaction,
    setTxFailed,
    submitTransaction,
  ])

  const estimatedTime = useMemo(
    () =>
      getEstimatedTxTime({
        chain: inputAsset.L1Chain as SupportedChain,
        amount: inputAmount,
      }),
    [inputAsset, inputAmount],
  )

  const inputAssetProps = useMemo(
    () => ({
      asset: inputAsset,
      value: inputAmount,
      balance: inputAssetBalance,
      usdPrice: inputAssetPriceInUSD,
    }),
    [inputAsset, inputAmount, inputAssetBalance, inputAssetPriceInUSD],
  )

  const outputAssetProps = useMemo(
    () => ({
      asset: outputAsset,
      value: outputAmount,
      usdPrice: outputAssetPriceInUSD,
    }),
    [outputAsset, outputAmount, outputAssetPriceInUSD],
  )

  const inputAssetList = useAssetsWithBalance(inputAssets)
  const outputAssetList = useAssetsWithBalance(outputAssets)

  const approveConfirmInfo = useApproveInfoItems({
    inputAsset: inputAssetProps,
    fee: totalFeeInUSD.toCurrencyFormat(2),
  })

  const title = `${t('common.swap')} ${inputAsset.name} >> ${outputAsset.name}`

  const swapAmountTooSmall = useMemo(() => {
    const minSwapAmount = totalFeeInUSD.gte(50) ? 50 : totalFeeInUSD.raw()

    return (
      swap?.outputAsset.L1Chain === 'ETH' &&
      outputAssetPriceInUSD.raw().lt(minSwapAmount)
    )
  }, [outputAssetPriceInUSD, swap?.outputAsset.L1Chain, totalFeeInUSD])

  const recipientTitle = useMemo(
    () =>
      thorname
        ? `${t('common.recipientAddress')} - ${thorname}.${outputAsset.L1Chain}`
        : t('common.recipientAddress'),
    [outputAsset.L1Chain, thorname],
  )

  return (
    <PanelView
      title={title}
      header={
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box center row className="space-x-2">
              <CountDownIndicator
                duration={POLL_GET_POOLS_INTERVAL / 1000}
                resetIndicator={poolLoading}
                onClick={getPools}
              />

              <Button
                onClick={navigateToPoolInfo}
                className="w-10 px-1.5 group"
                type="borderless"
                variant="tint"
                tooltip={t('common.poolAnalytics')}
                tooltipPlacement="top"
                startIcon={
                  <Icon
                    className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                    color="secondary"
                    name="chart"
                  />
                }
              />
              <GlobalSettingsPopover transactionMode />
            </Box>
          }
        />
      }
    >
      <AssetInputs
        inputAsset={inputAssetProps}
        outputAsset={outputAssetProps}
        inputAssetList={inputAssetList}
        outputAssetList={outputAssetList}
        onInputAssetChange={handleSelectAsset('input')}
        onOutputAssetChange={handleSelectAsset('output')}
        onInputAmountChange={handleChangeInputAmount}
        onSwitchPair={handleSwitchPair}
      />

      {customRecipientMode && (
        <PanelInput
          placeholder={t('common.thornameOrRecipient')}
          stretch
          disabled={addressDisabled}
          onChange={handleChangeRecipient}
          value={recipient}
          loading={loading}
          title={
            <Box flex={1} alignCenter justify="between">
              <Typography variant="caption" fontWeight="normal">
                {recipientTitle}
              </Typography>

              <Box>
                <HoverIcon
                  iconName={addressDisabled ? 'edit' : 'lock'}
                  size={16}
                  onClick={toggleAddressDisabled}
                />
                <HoverIcon
                  iconName="copy"
                  size={16}
                  onClick={handleCopyAddress}
                />
              </Box>
            </Box>
          }
        />
      )}

      <SwapInfo
        price={swap?.price}
        inputAsset={inputAssetProps}
        outputAsset={outputAssetProps}
        isValidSlip={isValidSlip}
        slippage={slipPercent.toFixed(3)}
        minReceive={`${minReceive.toSignificant(
          6,
        )} ${outputAsset.name.toUpperCase()}`}
        networkFee={totalFeeInUSD}
        affiliateFee={affiliateFeeInUSD}
        isAffiliated={isAffiliated}
      />

      <SwapSubmitButton
        recipient={recipient}
        isInputWalletConnected={isInputWalletConnected}
        inputAmount={inputAmount}
        inputAsset={inputAsset}
        outputAsset={outputAsset}
        setVisibleConfirmModal={setVisibleConfirmModal}
        swapAmountTooSmall={swapAmountTooSmall}
        hasSwap={!!swap}
        setVisibleApproveModal={setVisibleApproveModal}
        hasInSufficientFee={!!swap?.hasInSufficientFee}
        isValid={swap?.isValid()}
        pools={swap?.swapPools}
      />

      <ConfirmModal
        inputAssets={[inputAsset]}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirm}
      >
        <ConfirmContent
          inputAsset={inputAssetProps}
          outputAsset={outputAssetProps}
          recipient={recipient}
          estimatedTime={estimatedTime}
          slippage={slipPercent.toFixed(3)}
          isValidSlip={isValidSlip}
          minReceive={`${minReceive.toSignificant(
            4,
          )} ${outputAsset.name.toUpperCase()}`}
          totalFee={totalFeeInUSD.toCurrencyFormat(2)}
          affiliateFee={affiliateFeeInUSD?.toCurrencyFormat(2)}
          isAffiliated={isAffiliated}
          feeAssets={feeAssets}
        />
      </ConfirmModal>

      <ConfirmModal
        inputAssets={[inputAsset]}
        isOpened={visibleApproveModal}
        onClose={() => setVisibleApproveModal(false)}
        onConfirm={handleConfirmApprove}
      >
        <InfoTable items={approveConfirmInfo} />
      </ConfirmModal>
    </PanelView>
  )
}

export default SwapView
