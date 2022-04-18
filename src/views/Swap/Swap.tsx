import { useCallback, useMemo, useEffect, useState, ChangeEvent } from 'react'

import { useNavigate, useParams } from 'react-router'

import {
  Amount,
  Asset,
  getWalletAddressByChain,
  Percent,
  Price,
  getEstimatedTxTime,
  SupportedChain,
  hasWalletConnected,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import copy from 'copy-to-clipboard'

import { useSwap } from 'views/Swap/useSwap'
import { useSwapAssets } from 'views/Swap/useSwapAssets'

import { Button, Icon, Box, Typography } from 'components/Atomic'
import { ConfirmContent } from 'components/ConfirmModalConent'
import { CountDownIndicator } from 'components/CountDownIndicator'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTable } from 'components/InfoTable'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems'
import { PanelInput } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { showToast, ToastType } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus, TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApprove'
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance'
import { useBalance } from 'hooks/useBalance'
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB'
import { useNetworkFee } from 'hooks/useNetworkFee'
import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { translateErrorMsg } from 'helpers/error'

import {
  getPoolDetailRouteFromAsset,
  getSwapRoute,
  navigateToExternalLink,
  POLL_GET_POOLS_INTERVAL,
} from 'settings/constants'

import { AssetInputs } from './AssetInputs'
import { getSwapPair, getSwapTrackerType } from './helpers'
import { SwapInfo } from './SwapInfo'
import { Pair } from './types'

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
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)

  const { getMaxBalance } = useBalance()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()
  const { totalFeeInUSD } = useNetworkFee({ inputAsset, outputAsset })
  const { poolLoading, inboundData, getPools } = useMidgard()
  const { customRecipientMode } = useApp()

  const { outputAssets, inputAssets, pools } = useSwapAssets()
  const swap = useSwap({
    poolLoading,
    inputAmount,
    inputAsset,
    pools,
    outputAsset,
  })

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

  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const isOutputWalletConnected = useMemo(
    () =>
      outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  )

  const { isApproved, assetApproveStatus } = useApprove(
    inputAsset,
    isInputWalletConnected,
  )

  const isTradingHalted: boolean = useMemo(() => {
    const inTradeInboundData = inboundData.find(
      ({ chain }) => chain === inputAsset.chain,
    )
    const outTradeInboundData = inboundData.find(
      ({ chain }) => chain === outputAsset.chain,
    )

    const haltedStatus =
      (inTradeInboundData?.halted ?? false) ||
      (outTradeInboundData?.halted ?? false)

    return haltedStatus
  }, [inboundData, inputAsset, outputAsset])

  const walletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const isWalletRequired = useMemo(() => {
    if (!isInputWalletConnected) return true
    if (!isOutputWalletConnected && !recipient) return true

    return false
  }, [isInputWalletConnected, isOutputWalletConnected, recipient])

  const handleCopyAddress = useCallback(() => {
    copy(recipient)

    showToast({ message: t('notification.addressCopied') })
  }, [recipient])

  const { isExchangeBNBAddress } = useCheckExchangeBNB(
    outputAsset.chain === Chain.Binance ? recipient : null,
  )

  const toggleAddressDisabled = useCallback(() => {
    setAddressDisabled(!addressDisabled)
  }, [addressDisabled])

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setRecipient(value),
    [],
  )

  const isValidAddress = useMemo(() => {
    try {
      if (!recipient) return true

      if (isExchangeBNBAddress) return false

      return multichain.validateAddress({
        chain: outputAsset.L1Chain,
        address: recipient,
      })
    } catch (error) {
      console.error(error)
      return false
    }
  }, [outputAsset, recipient, isExchangeBNBAddress])

  // for GA tracking purpose
  // const isCustomRecipient = useMemo(() => {
  //   if (!wallet) return false
  //   return getWalletAddressByChain(wallet, outputAsset.L1Chain) === recipient
  // }, [wallet, outputAsset, recipient])

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

  const inputAssetPriceInUSD = useMemo(
    () => new Price({ baseAsset: inputAsset, pools, priceAmount: inputAmount }),
    [inputAsset, inputAmount, pools],
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

  const inputAssetBalance: Amount | undefined = useMemo(() => {
    if (!isInputWalletConnected) {
      return undefined
    }

    return getMaxBalance(inputAsset)
  }, [inputAsset, isInputWalletConnected, getMaxBalance])

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

      navigate(getSwapRoute(input, output))
    },
    [inputAsset, navigate, outputAsset],
  )

  const handleSwitchPair = useCallback(() => {
    navigate(getSwapRoute(outputAsset, inputAsset))
  }, [navigate, inputAsset, outputAsset])

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

      // register to tx tracker
      const trackId = submitTransaction({
        type: trackerType,
        submitTx: {
          inAssets: [
            {
              asset: swap.inputAsset.toString(),
              amount: swap.inputAmount.toSignificant(6),
            },
          ],
          outAssets: [
            {
              asset: swap.outputAsset.toString(),
              amount: swap.outputAmountAfterFee.toSignificant(6),
            },
          ],
        },
      })

      try {
        const txHash = await multichain.swap(swap, recipient)

        // start polling
        pollTransaction({
          type: trackerType,
          uuid: trackId,
          submitTx: {
            inAssets: [
              {
                asset: swap.inputAsset.toString(),
                amount: swap.inputAmount.toSignificant(6),
              },
            ],
            outAssets: [
              {
                asset: swap.outputAsset.toString(),
                amount: swap.outputAmountAfterFee.toSignificant(6),
              },
            ],
            txID: txHash,
          },
        })
      } catch (error: NotWorthIt) {
        setTxFailed(trackId)
        const description = translateErrorMsg(error?.toString())

        showToast(
          {
            message: t('notification.submitTxFailed'),
            description,
          },
          ToastType.Error,
          {
            duration: 20 * 1000,
          },
        )
        console.error(error)
      }
    }
  }, [wallet, swap, recipient, submitTransaction, pollTransaction, setTxFailed])

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false)

    if (isInputWalletConnected) {
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx: {
          inAssets: [
            {
              asset: inputAsset.toString(),
              amount: '0', // not needed for approve tx
            },
          ],
        },
      })

      try {
        const txHash = await multichain.approveAsset(inputAsset)

        if (txHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Approve,
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: inputAsset.toString(),
                  amount: '0', // not needed for approve tx
                },
              ],
              txID: txHash,
            },
          })
        }
      } catch (error) {
        setTxFailed(trackId)
        showToast(
          { message: t('notification.approveFailed') },
          ToastType.Error,
          { duration: 20 * 1000 },
        )
        console.error(error)
      }
    }
  }, [
    inputAsset,
    isInputWalletConnected,
    pollTransaction,
    setTxFailed,
    submitTransaction,
  ])

  const showSwapConfirmationModal = useCallback(() => {
    if (walletConnected && swap) {
      if (
        swap.outputAsset.L1Chain === 'ETH' &&
        outputAssetPriceInUSD.raw().lt(50)
      ) {
        showToast({
          message: t('notification.swapAmountTooSmall'),
          description: t('notification.swapAmountTooSmallDesc'),
        })
        return
      }

      if (swap.hasInSufficientFee) {
        showToast({
          message: t('notification.swapInsufficientFee'),
          description: t('notification.swapInsufficientFeeDesc'),
        })
        return
      }

      if (isExchangeBNBAddress) {
        showToast(
          {
            message: t('notification.exchangeBNBAddy'),
            description: t('notification.exchangeBNBAddyDesc'),
          },
          ToastType.Error,
        )
        return
      }

      if (!isValidAddress) {
        showToast(
          {
            message: t('notification.invalidRecipientAddy'),
            description: t('notification.invalidRecipientAddyDesc'),
          },
          ToastType.Error,
        )
        return
      }

      setVisibleConfirmModal(true)
    } else {
      showToast({
        message: t('notification.walletNotFound'),
        description: t('notification.connectWallet'),
      })
    }
  }, [
    isValidAddress,
    isExchangeBNBAddress,
    walletConnected,
    swap,
    outputAssetPriceInUSD,
  ])

  const handleApprove = useCallback(() => {
    if (isInputWalletConnected && swap) {
      setVisibleApproveModal(true)
    } else {
      showToast({
        message: t('notification.walletNotFound'),
        description: t('notification.connectWallet'),
      })
    }
  }, [isInputWalletConnected, swap])

  const isValidSwap = useMemo(() => {
    if (isTradingHalted) {
      return {
        valid: false,
        msg: t('notification.swapNotAvailable'),
      }
    }

    return swap?.isValid() ?? { valid: false }
  }, [swap, isTradingHalted])

  const isValidSlip = useMemo(() => swap?.isSlipValid() ?? true, [swap])

  const btnLabel = useMemo(() => {
    if (isValidSwap.valid || inputAmount.eq(0)) {
      if (inputAsset.isSynth && outputAsset.isSynth) {
        return t('common.swap')
      }
      if (inputAsset.isSynth) {
        return t('txManager.redeem')
      }
      if (outputAsset.isSynth) {
        return t('txManager.mint')
      }
      return t('common.swap')
    }

    return isValidSwap?.msg ?? t('common.swap')
  }, [isValidSwap, inputAmount, inputAsset, outputAsset])

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

  const isApproveRequired = useMemo(
    () => isInputWalletConnected && isApproved === false,
    [isInputWalletConnected, isApproved],
  )

  const isSwapAvailable = useMemo(
    () => !isWalletRequired && !isApproveRequired,
    [isWalletRequired, isApproveRequired],
  )

  const buttonLoading = useMemo(
    () =>
      [TxTrackerStatus.Pending, TxTrackerStatus.Submitting].includes(
        assetApproveStatus,
      ),
    [assetApproveStatus],
  )

  const title = `${t('common.swap')} ${inputAsset.name} >> ${outputAsset.name}`

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
          placeholder={`${t('common.recipientAddress')} ${t('common.here')}`}
          stretch
          disabled={addressDisabled}
          onChange={handleChangeRecipient}
          value={recipient}
          title={
            <Box flex={1} alignCenter justify="between">
              <Typography variant="caption" fontWeight="normal">
                {t('common.recipientAddress')}
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
                {/* <HoverIcon iconName="share" size={16} onClick={() => {}} /> */}
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
        networkFee={totalFeeInUSD.toCurrencyFormat(2)}
      />

      <Box className="w-full pt-5 gap-x-2">
        {isWalletRequired && (
          <Button
            isFancy
            stretch
            size="lg"
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        )}

        {isApproveRequired && (
          <Button
            isFancy
            stretch
            size="lg"
            onClick={handleApprove}
            loading={buttonLoading}
          >
            {t('txManager.approve')}
          </Button>
        )}

        {isSwapAvailable && (
          <Button
            isFancy
            error={!isValidSwap.valid}
            stretch
            size="lg"
            onClick={showSwapConfirmationModal}
          >
            {btnLabel}
          </Button>
        )}
      </Box>

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
