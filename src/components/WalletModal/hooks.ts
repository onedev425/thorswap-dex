import { useCallback, useMemo } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import {
  MetaMaskWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Chain, TERRAChain } from '@thorswap-lib/xchain-util'

import { IconName } from 'components/Atomic'
import { showErrorToast } from 'components/Toast'
import { WalletStage, WalletType } from 'components/WalletModal/types'

import { useWallet } from 'store/wallet/hooks'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { xdefi } from 'services/xdefi'

type WalletItem = {
  type: WalletType
  icon: IconName
  label: string
  visible?: boolean
}

type UseWalletOptionsParams = {
  isMdActive: boolean
}

export const useWalletOptions = ({
  isMdActive,
}: UseWalletOptionsParams): WalletItem[] => {
  const metamaskStatus = useMemo(() => metamask.isWalletDetected(), [])
  const xdefiStatus = useMemo(() => xdefi.isWalletDetected(), [])
  const { isTerraStationAvailable } = useTerraWallet()

  const metamaskLabel = useMemo(
    () =>
      metamaskStatus === MetaMaskWalletStatus.XdefiDetected
        ? t('views.walletModal.disableXdefi')
        : t('views.walletModal.metaMask'),
    [metamaskStatus],
  )

  const xdefiLabel = useMemo(
    () =>
      xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized
        ? t('views.walletModal.prioritiseXdefi')
        : t('views.walletModal.xdefi'),
    [xdefiStatus],
  )

  return [
    {
      visible: isMdActive,
      type: WalletType.Xdefi,
      label: xdefiLabel,
      icon: 'xdefi',
    },
    {
      visible: isMdActive,
      type: WalletType.Phantom,
      label: t('views.walletModal.phantom'),
      icon: 'phantom',
    },
    ...(isTerraStationAvailable
      ? [
          {
            visible: isMdActive,
            type: WalletType.Terra,
            icon: 'station' as const,
            label: t('views.walletModal.terraStation'),
          },
        ]
      : []),
    {
      type: WalletType.TerraMobile,
      icon: 'terra',
      label: t('views.walletModal.connectTerraMobile'),
    },
    {
      type: WalletType.TrustWallet,
      icon: 'walletConnect',
      label: t('views.walletModal.walletConnect'),
    },
    {
      type: WalletType.MetaMask,
      icon: 'metamask',
      label: metamaskLabel,
    },
    {
      visible: isMdActive,
      type: WalletType.Ledger,
      icon: 'ledger',
      label: t('views.walletModal.ledger'),
    },
    {
      type: WalletType.Keystore,
      icon: 'keystore',
      label: t('views.walletModal.keystore'),
    },
    {
      type: WalletType.CreateKeystore,
      icon: 'plusCircle',
      label: t('views.walletModal.createKeystore'),
      visible: isMdActive,
    },
    {
      type: WalletType.Phrase,
      icon: 'import',
      label: t('views.walletModal.importPhrase'),
      visible: isMdActive,
    },
  ]
}

type HandleWalletConnectParams = {
  walletType: WalletType
  ledgerIndex: number
  pendingChains: SupportedChain[]
  setWalletStage: (stage: WalletStage) => void
  clearStatus: () => void
}

export const useHandleWalletConnect = ({
  walletType,
  clearStatus,
  ledgerIndex,
  pendingChains,
  setWalletStage,
}: HandleWalletConnectParams) => {
  const {
    connectXdefiWallet,
    connectMetamask,
    connectPhantom,
    connectLedger,
    connectTrustWallet,
  } = useWallet()
  const { connectTerraWallet } = useTerraWallet()

  const handleConnectLedger = useCallback(
    async (chain: Chain, index: number) => {
      await connectLedger(chain, index)
      clearStatus()
    },
    [connectLedger, clearStatus],
  )

  const handleConnectMetaMask = useCallback(async () => {
    try {
      await connectMetamask()
    } catch (error) {
      showErrorToast(t('notification.metamaskFailed'))
    }

    clearStatus()
  }, [connectMetamask, clearStatus])

  const handleConnectPhantom = useCallback(async () => {
    await connectPhantom()

    clearStatus()
  }, [connectPhantom, clearStatus])

  const handleConnectXdefi = useCallback(
    async (chains: SupportedChain[]) => {
      try {
        if (chains.includes(TERRAChain) && !!window.xfi.terra) {
          connectTerraWallet(TerraConnectType.EXTENSION, 'xdefi-wallet')
        }

        await connectXdefiWallet(chains)
      } catch (error) {
        console.error(error)
        showErrorToast(t('notification.xdefiFailed'))
      }
      clearStatus()
    },
    [clearStatus, connectXdefiWallet, connectTerraWallet],
  )

  const handleConnectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      try {
        await connectTrustWallet(chains)
      } catch (error) {
        showErrorToast(t('notification.trustFailed'))
      }
      clearStatus()
    },
    [connectTrustWallet, clearStatus],
  )

  const handleConnectWallet = useCallback(() => {
    switch (walletType) {
      case WalletType.TrustWallet:
        return handleConnectTrustWallet(pendingChains)
      case WalletType.Keystore:
        return setWalletStage(WalletStage.Final)
      case WalletType.Xdefi:
        return handleConnectXdefi(pendingChains)
      case WalletType.Ledger:
        return handleConnectLedger(pendingChains[0], ledgerIndex)
      case WalletType.MetaMask:
        return handleConnectMetaMask()
      case WalletType.Phantom:
        return handleConnectPhantom()
    }
  }, [
    ledgerIndex,
    pendingChains,
    setWalletStage,
    walletType,
    handleConnectLedger,
    handleConnectMetaMask,
    handleConnectPhantom,
    handleConnectTrustWallet,
    handleConnectXdefi,
  ])

  return handleConnectWallet
}
