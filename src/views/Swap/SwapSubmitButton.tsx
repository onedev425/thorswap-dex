import { useCallback, useMemo } from 'react'

import { Amount, Asset, hasWalletConnected } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { Box, Button } from 'components/Atomic'
import { showToast, ToastType } from 'components/Toast'

import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApprove'
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

type Props = {
  recipient: string | null
  isInputWalletConnected: boolean
  inputAsset: Asset
  outputAsset: Asset
  inputAmount: Amount
  swapAmountTooSmall: boolean
  hasSwap: boolean
  hasInSufficientFee: boolean
  isValid?: { valid: boolean; msg?: string }
  setVisibleConfirmModal: (visible: boolean) => void
  setVisibleApproveModal: (visible: boolean) => void
}

export const SwapSubmitButton = ({
  recipient,
  isInputWalletConnected,
  inputAmount,
  inputAsset,
  outputAsset,
  setVisibleConfirmModal,
  swapAmountTooSmall,
  hasSwap,
  setVisibleApproveModal,
  hasInSufficientFee,
  isValid,
}: Props) => {
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { inboundData } = useMidgard()

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

    return (
      (inTradeInboundData?.halted ?? false) ||
      (outTradeInboundData?.halted ?? false)
    )
  }, [inboundData, inputAsset, outputAsset])

  const walletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const { isExchangeBNBAddress } = useCheckExchangeBNB(
    outputAsset.chain === Chain.Binance ? recipient : null,
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

  const showSwapConfirmationModal = useCallback(() => {
    if (walletConnected && hasSwap) {
      if (swapAmountTooSmall) {
        return showToast({
          message: t('notification.swapAmountTooSmall'),
          description: t('notification.swapAmountTooSmallDesc'),
        })
      }

      if (hasInSufficientFee) {
        return showToast({
          message: t('notification.swapInsufficientFee'),
          description: t('notification.swapInsufficientFeeDesc'),
        })
      }

      if (isExchangeBNBAddress) {
        return showToast(
          {
            message: t('notification.exchangeBNBAddy'),
            description: t('notification.exchangeBNBAddyDesc'),
          },
          ToastType.Error,
        )
      }

      if (!isValidAddress) {
        return showToast(
          {
            message: t('notification.invalidRecipientAddy'),
            description: t('notification.invalidRecipientAddyDesc'),
          },
          ToastType.Error,
        )
      }

      setVisibleConfirmModal(true)
    } else {
      showToast({
        message: t('notification.walletNotFound'),
        description: t('notification.connectWallet'),
      })
    }
  }, [
    walletConnected,
    hasSwap,
    swapAmountTooSmall,
    hasInSufficientFee,
    isExchangeBNBAddress,
    isValidAddress,
    setVisibleConfirmModal,
  ])

  const handleApprove = useCallback(() => {
    if (isInputWalletConnected && hasSwap) {
      setVisibleApproveModal(true)
    } else {
      showToast({
        message: t('notification.walletNotFound'),
        description: t('notification.connectWallet'),
      })
    }
  }, [hasSwap, isInputWalletConnected, setVisibleApproveModal])

  const isValidSwap = useMemo(
    () =>
      isTradingHalted
        ? { valid: false, msg: t('notification.swapNotAvailable') }
        : isValid ?? { valid: false },
    [isTradingHalted, isValid],
  )

  const btnLabel = useMemo(() => {
    if (isValidSwap?.valid || inputAmount.eq(0)) {
      if (inputAsset.isSynth && outputAsset.isSynth) return t('common.swap')
      if (inputAsset.isSynth) return t('txManager.redeem')
      if (outputAsset.isSynth) return t('txManager.mint')

      return t('common.swap')
    }

    return isValid?.msg ?? t('common.swap')
  }, [
    isValidSwap?.valid,
    inputAmount,
    isValid?.msg,
    inputAsset.isSynth,
    outputAsset.isSynth,
  ])

  const isApproveRequired = useMemo(
    () => isInputWalletConnected && isApproved === false,
    [isInputWalletConnected, isApproved],
  )

  const isOutputWalletConnected = useMemo(
    () =>
      outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  )

  const isWalletRequired = useMemo(
    () => !isInputWalletConnected || !(isOutputWalletConnected || recipient),
    [isInputWalletConnected, isOutputWalletConnected, recipient],
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

  return (
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
          error={!isValid?.valid}
          stretch
          size="lg"
          onClick={showSwapConfirmationModal}
        >
          {btnLabel}
        </Button>
      )}
    </Box>
  )
}
