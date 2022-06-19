import { useCallback, useMemo } from 'react'

import {
  Amount,
  Asset,
  hasWalletConnected,
  Pool,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { Box, Button } from 'components/Atomic'
import { showErrorToast, showInfoToast } from 'components/Toast'

import { useExternalConfig } from 'store/externalConfig/hooks'
import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApprove'
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB'
import { useMimir } from 'hooks/useMimir'

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
  pools?: Pool[]
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
  pools,
}: Props) => {
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { inboundData } = useMidgard()
  const { maxSynthPerAssetDepth } = useMimir()
  const { getChainTradingPaused } = useExternalConfig()

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
      (outTradeInboundData?.halted ?? false) ||
      getChainTradingPaused(inputAsset.chain as SupportedChain) ||
      getChainTradingPaused(outputAsset.chain as SupportedChain)
    )
  }, [getChainTradingPaused, inboundData, inputAsset.chain, outputAsset.chain])

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
        return showInfoToast(
          t('notification.swapAmountTooSmall'),
          t('notification.swapAmountTooSmallDesc'),
        )
      }

      if (hasInSufficientFee) {
        return showInfoToast(
          t('notification.swapInsufficientFee'),
          t('notification.swapInsufficientFeeDesc'),
        )
      }

      if (isExchangeBNBAddress) {
        return showErrorToast(
          t('notification.exchangeBNBAddy'),
          t('notification.exchangeBNBAddyDesc'),
        )
      }

      if (!isValidAddress) {
        return showErrorToast(
          t('notification.invalidRecipientAddy'),
          t('notification.invalidRecipientAddyDesc'),
        )
      }

      setVisibleConfirmModal(true)
    } else {
      showInfoToast(
        t('notification.walletNotFound'),
        t('notification.connectWallet'),
      )
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
      showInfoToast(
        t('notification.walletNotFound'),
        t('notification.connectWallet'),
      )
    }
  }, [hasSwap, isInputWalletConnected, setVisibleApproveModal])

  const isSynthMintable = useMemo((): boolean => {
    // Skip check when it's not synth minting
    if (!outputAsset.isSynth || !pools) return true

    const { assetDepth, synthSupply } = pools[pools.length - 1].detail
    const assetDepthAmount = Amount.fromMidgard(assetDepth)
    const synthSupplyAmount = Amount.fromMidgard(synthSupply)

    if (assetDepthAmount.eq(0)) return true

    return synthSupplyAmount
      .div(assetDepthAmount)
      .assetAmount.isLessThan(maxSynthPerAssetDepth / 10000)
  }, [maxSynthPerAssetDepth, outputAsset.isSynth, pools])

  const isValidSwap = useMemo(
    () =>
      isTradingHalted || !isSynthMintable
        ? {
            msg: isSynthMintable
              ? t('notification.swapNotAvailable')
              : t('txManager.mint'),
            valid: false,
          }
        : isValid ?? { valid: false },
    [isSynthMintable, isTradingHalted, isValid],
  )

  const btnLabel = useMemo(() => {
    if (isValidSwap?.valid || inputAmount.eq(0)) {
      if (inputAsset.isSynth && outputAsset.isSynth) return t('common.swap')
      if (inputAsset.isSynth) return t('txManager.redeem')
      if (outputAsset.isSynth) return t('txManager.mint')

      return t('common.swap')
    }

    return isValidSwap?.msg ?? t('common.swap')
  }, [isValidSwap, inputAmount, inputAsset.isSynth, outputAsset.isSynth])

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
          disabled={!isValidSwap.valid}
          error={!isValidSwap?.valid}
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
