import { useCallback, useMemo } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import {
  MetaMaskWalletStatus,
  PhantomWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { Box } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'
import { showErrorToast } from 'components/Toast'
import { useWalletOptions } from 'components/WalletModal/hooks'

import { useWallet } from 'store/wallet/hooks'

import { useTerraWallet } from 'hooks/useTerraWallet'
import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { phantom } from 'services/phantom'
import { xdefi } from 'services/xdefi'

import { WalletType, WalletStage, availableChainsByWallet } from './types'
import { WalletOption } from './WalletOption'

type Props = {
  clearStatus: () => void
  setWalletType: (walletType: WalletType) => void
  setWalletStage: (walletStage: WalletStage) => void
  setPendingChains: (pendingChains: SupportedChain[]) => void
}

export const WalletTypes = ({
  clearStatus,
  setWalletType,
  setWalletStage,
  setPendingChains,
}: Props) => {
  const { isMdActive } = useWindowSize()
  const phantomStatus = useMemo(() => phantom.isWalletDetected(), [])
  const metamaskStatus = useMemo(() => metamask.isWalletDetected(), [])
  const xdefiStatus = useMemo(() => xdefi.isWalletDetected(), [])
  const { connectTerraStation } = useWallet()
  const { isTerraStationInstalled, installTerraWallet } = useTerraWallet()

  const handleConnectTerraWallet = useCallback(
    (connectType: TerraConnectType, identifier?: string) => {
      connectTerraStation(connectType, identifier)
      clearStatus()
    },
    [clearStatus, connectTerraStation],
  )

  const handleWalletTypeSelect = useCallback(
    (selectedWallet: WalletType) => {
      if (selectedWallet === WalletType.Xdefi) {
        if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
          window.open('https://xdefi.io')
          return
        }

        if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
          return showErrorToast(
            t('notification.prioritisationError'),
            t('notification.xdefiPrioritise'),
          )
        }
      }

      if (selectedWallet === WalletType.MetaMask) {
        if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
          return window.open('https://metamask.io')
        }

        if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
          return showErrorToast(
            t('notification.prioritisationError'),
            t('notification.xdefiDeprioritise'),
          )
        }
      }

      // install or connect terra wallet
      if (selectedWallet === WalletType.Terra) {
        if (isTerraStationInstalled) {
          handleConnectTerraWallet(TerraConnectType.EXTENSION, 'station')
        } else {
          installTerraWallet(TerraConnectType.EXTENSION)
        }
        return
      }

      // terra station mobile
      if (selectedWallet === WalletType.TerraMobile) {
        handleConnectTerraWallet(TerraConnectType.WALLETCONNECT)
        return clearStatus()
      }

      // Phantom wallet
      if (
        selectedWallet === WalletType.Phantom &&
        phantomStatus === PhantomWalletStatus.NoWeb3Provider
      ) {
        return window.open('https://phantom.app')
      }

      setWalletType(selectedWallet)

      if (
        [
          WalletType.TrustWallet,
          WalletType.Xdefi,
          WalletType.Ledger,
          WalletType.Keystore,
          WalletType.MetaMask,
          WalletType.Phantom,
        ].includes(selectedWallet)
      ) {
        setWalletStage(WalletStage.ChainSelect)
        setPendingChains(
          selectedWallet === WalletType.Ledger
            ? [Chain.Bitcoin]
            : availableChainsByWallet[selectedWallet],
        )
      } else {
        setWalletStage(WalletStage.Final)
      }
    },
    [
      setPendingChains,
      setWalletStage,
      setWalletType,
      phantomStatus,
      xdefiStatus,
      metamaskStatus,
      isTerraStationInstalled,
      installTerraWallet,
      handleConnectTerraWallet,
      clearStatus,
    ],
  )

  const walletOptions = useWalletOptions({ isMdActive })

  return (
    <Scrollbar maxHeight="60vh" customStyle={{ marginRight: '-12px' }}>
      <Box className="px-4 gap-4 flex-wrap justify-center">
        {walletOptions.map(
          ({ type, label, icon, visible = true }) =>
            visible && (
              <WalletOption
                key={label}
                label={label}
                icon={icon}
                type={type}
                handleTypeSelect={handleWalletTypeSelect}
              />
            ),
        )}
      </Box>
    </Scrollbar>
  )
}
