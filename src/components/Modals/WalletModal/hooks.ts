import { useCallback, useMemo } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import {
  MetaMaskWalletStatus,
  PhantomWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
  KeplrWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Chain, TERRAChain } from '@thorswap-lib/xchain-util'

import { IconName } from 'components/Atomic'
import {
  availableChainsByWallet,
  WalletStage,
  WalletType,
} from 'components/Modals/WalletModal/types'
import { showErrorToast } from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { keplr } from 'services/keplr'
import { metamask } from 'services/metamask'
import { phantom } from 'services/phantom'
import { xdefi } from 'services/xdefi'

import { IS_STAGENET } from 'settings/config'

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
  const { isTerraStationAvailable } = useTerraWallet()

  return useMemo(
    () => [
      {
        icon: 'xdefi',
        type: WalletType.Xdefi,
        visible: isMdActive,
        label:
          xdefi.isWalletDetected() === XdefiWalletStatus.XdefiNotPrioritized
            ? t('views.walletModal.prioritiseXdefi')
            : t('views.walletModal.xdefi'),
      },
      {
        icon: 'phantom',
        label: t('views.walletModal.phantom'),
        type: WalletType.Phantom,
        visible: isMdActive,
      },
      ...(IS_STAGENET
        ? [
            {
              icon: 'keplr' as const,
              label: t('views.walletModal.keplr'),
              type: WalletType.Keplr,
              visible: isMdActive,
            },
          ]
        : []),
      ...(isTerraStationAvailable
        ? [
            {
              icon: 'station' as const,
              label: t('views.walletModal.terraStation'),
              type: WalletType.Terra,
              visible: isMdActive,
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
        label:
          metamask.isWalletDetected() === MetaMaskWalletStatus.XdefiDetected
            ? t('views.walletModal.disableXdefi')
            : t('views.walletModal.metaMask'),
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
    ],
    [isMdActive, isTerraStationAvailable],
  )
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
    connectKeplr,
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

  const handleConnectKeplr = useCallback(async () => {
    await connectKeplr()
    clearStatus()
  }, [connectKeplr, clearStatus])

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
      case WalletType.Keplr:
        return handleConnectKeplr()
    }
  }, [
    ledgerIndex,
    pendingChains,
    setWalletStage,
    walletType,
    handleConnectKeplr,
    handleConnectLedger,
    handleConnectMetaMask,
    handleConnectPhantom,
    handleConnectTrustWallet,
    handleConnectXdefi,
  ])

  return handleConnectWallet
}

type HandleWalletTypeSelectParams = {
  setWalletType: (walletType: WalletType) => void
  setWalletStage: (stage: WalletStage) => void
  setPendingChains: (chains: SupportedChain[]) => void
  clearStatus: () => void
}

export const useHandleWalletTypeSelect = ({
  setWalletType,
  setWalletStage,
  clearStatus,
  setPendingChains,
}: HandleWalletTypeSelectParams) => {
  const { isTerraStationInstalled, installTerraWallet } = useTerraWallet()
  const { connectTerraStation } = useWallet()

  const handleXdefi = useCallback(() => {
    const xdefiStatus = xdefi.isWalletDetected()

    if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
      window.open('https://xdefi.io')
    }

    if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
      showErrorToast(
        t('notification.prioritisationError'),
        t('notification.xdefiPrioritise'),
      )
    }

    return xdefiStatus === XdefiWalletStatus.XdefiPrioritized
  }, [])

  const handleMetamask = useCallback(() => {
    const xdefiStatus = xdefi.isWalletDetected()
    const metamaskStatus = metamask.isWalletDetected()

    if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
      window.open('https://metamask.io')
    }

    if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
      showErrorToast(
        t('notification.prioritisationError'),
        t('notification.xdefiDeprioritise'),
      )
    }

    return (
      metamaskStatus === MetaMaskWalletStatus.MetaMaskDetected &&
      xdefiStatus !== XdefiWalletStatus.XdefiPrioritized
    )
  }, [])

  const handleConnectTerraWallet = useCallback(
    (connectType: TerraConnectType, identifier?: string) => {
      connectTerraStation(connectType, identifier)
      clearStatus()
    },
    [clearStatus, connectTerraStation],
  )

  const handleTerra = useCallback(
    (mobile: boolean) => {
      const connectionType = mobile
        ? TerraConnectType.WALLETCONNECT
        : TerraConnectType.EXTENSION
      const success = mobile || isTerraStationInstalled

      if (success) {
        handleConnectTerraWallet(connectionType, mobile ? undefined : 'station')
      } else {
        installTerraWallet(TerraConnectType.EXTENSION)
      }

      return success
    },
    [handleConnectTerraWallet, installTerraWallet, isTerraStationInstalled],
  )

  const handlePhantom = useCallback(() => {
    const phantomStatus = phantom.isWalletDetected()

    if (phantomStatus === PhantomWalletStatus.PhantomDetected) {
      return true
    } else {
      window.open('https://phantom.app')
      return false
    }
  }, [])

  const handleKeplr = useCallback(() => {
    const keplrStatus = keplr.isWalletDetected()

    if (keplrStatus === KeplrWalletStatus.KeplrDetected) {
      return true
    } else {
      window.open('https://keplr.app')
      return false
    }
  }, [])

  const handleSuccessWalletConnection = useCallback(
    (selectedWallet: WalletType) => {
      const skipChainSelect = [
        WalletType.CreateKeystore,
        WalletType.Phrase,
        WalletType.Select,
        WalletType.Terra,
        WalletType.TerraMobile,
      ].includes(selectedWallet)

      setWalletType(selectedWallet)

      if (skipChainSelect) {
        setWalletStage(WalletStage.Final)
      } else {
        setWalletStage(WalletStage.ChainSelect)
        setPendingChains(
          selectedWallet === WalletType.Ledger
            ? [Chain.Bitcoin]
            : availableChainsByWallet[selectedWallet],
        )
      }
    },
    [setPendingChains, setWalletStage, setWalletType],
  )

  const connectSelectedWallet = useCallback(
    (selectedWallet: WalletType): boolean => {
      switch (selectedWallet) {
        case WalletType.Xdefi:
          return handleXdefi()
        case WalletType.MetaMask:
          return handleMetamask()
        case WalletType.Phantom:
          return handlePhantom()
        case WalletType.Keplr:
          return handleKeplr()
        case WalletType.Terra:
        case WalletType.TerraMobile:
          return handleTerra(selectedWallet === WalletType.TerraMobile)

        default:
          return true
      }
    },
    [handleMetamask, handlePhantom, handleTerra, handleXdefi, handleKeplr],
  )

  const handleWalletTypeSelect = useCallback(
    (selectedWallet: WalletType) => {
      const success = connectSelectedWallet(selectedWallet)

      if (success) {
        handleSuccessWalletConnection(selectedWallet)
      }
    },
    [connectSelectedWallet, handleSuccessWalletConnection],
  )

  return handleWalletTypeSelect
}
