import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  chainToSigAsset,
  MetaMaskWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Card, Icon, Modal, Typography } from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { xdefi } from 'services/xdefi'

import { ChainOption } from './ChainOption'
import { WalletMode, WalletStage, availableChainsByWallet } from './types'
import { WalletOption } from './WalletOption'

export const WalletModal = () => {
  const [walletMode, setWalletMode] = useState<WalletMode>(WalletMode.Select)
  const [walletStage, setWalletStage] = useState<WalletStage>(
    WalletStage.WalletSelect,
  )
  const [pendingChains, setPendingChains] = useState<SupportedChain[]>([])

  const { isConnectModalOpen, setIsConnectModalOpen } = useWallet()

  console.log('pending - ', pendingChains)

  useEffect(() => {
    if (isConnectModalOpen) setWalletMode(WalletMode.Select)
  }, [isConnectModalOpen])

  const metamaskStatus = useMemo(() => metamask.isWalletDetected(), [])
  const xdefiStatus = useMemo(() => xdefi.isWalletDetected(), [])
  const modalTitle = useMemo(() => {
    if (walletStage === WalletStage.WalletSelect)
      return t('views.walletModal.connectWallet')

    if (walletStage === WalletStage.ChainSelect)
      return t('views.walletModal.selectChain')

    return t('views.walletModal.connectWallet')
  }, [walletStage])

  const handleChainSelect = useCallback(
    (selectedWallet: WalletMode) => {
      if (selectedWallet === WalletMode.Xdefi) {
        if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
          window.open('https://xdefi.io')
          return
        }

        if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
          // TODO: Should show alert to prioritize the XDEFI wallet
          return
        }
      }

      if (selectedWallet === WalletMode.MetaMask) {
        if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
          window.open('https://metamask.io')
          return
        }

        if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
          // TODO: Should disable xdefi wallet
          return
        }
      }

      setWalletMode(selectedWallet)

      if (
        selectedWallet === WalletMode.TrustWallet ||
        selectedWallet === WalletMode.Xdefi ||
        selectedWallet === WalletMode.Ledger ||
        selectedWallet === WalletMode.Keystore ||
        selectedWallet === WalletMode.MetaMask
      ) {
        setWalletStage(WalletStage.ChainSelect)

        if (selectedWallet === WalletMode.Ledger) {
          setPendingChains([Chain.Binance])
        } else {
          setPendingChains(availableChainsByWallet[selectedWallet])
        }
      } else setWalletStage(WalletStage.Final)
    },
    [metamaskStatus, xdefiStatus],
  )

  const handleCloseModal = useCallback(() => {
    setIsConnectModalOpen(false)
  }, [setIsConnectModalOpen])

  const renderMainPanel = useMemo(() => {
    return (
      <Box className="w-full space-y-3" col>
        <WalletOption onClick={() => handleChainSelect(WalletMode.Xdefi)}>
          {xdefiStatus === XdefiWalletStatus.XdefiPrioritized && (
            <Typography>{t('views.walletModal.connectXdefi')}</Typography>
          )}
          {xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized && (
            <Typography>{t('views.walletModal.prioritiseXdefi')}</Typography>
          )}
          {xdefiStatus === XdefiWalletStatus.XdefiNotInstalled && (
            <Typography>{t('views.walletModal.installXdefi')}</Typography>
          )}
          <Icon name="xdefi" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.walletConnect')}</Typography>
          <Icon name="walletConnect" />
        </WalletOption>
        <WalletOption>
          {metamaskStatus === MetaMaskWalletStatus.MetaMaskDetected && (
            <Typography>{t('views.walletModal.connectMetaMask')}</Typography>
          )}
          {metamaskStatus === MetaMaskWalletStatus.XdefiDetected && (
            <Typography>{t('views.walletModal.disableXdefi')}</Typography>
          )}
          {metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider && (
            <Typography>{t('views.walletModal.installMetaMask')}</Typography>
          )}
          <Icon name="metamask" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.connectLedger')}</Typography>
          <Icon name="ledger" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.connectOnboard')}</Typography>
          <Icon name="onboard" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.connectKeystore')}</Typography>
          <Icon name="keystore" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.createKeystore')}</Typography>
          <Icon name="plus" />
        </WalletOption>
        <WalletOption>
          <Typography>{t('views.walletModal.importPhrase')}</Typography>
          <Icon name="import" />
        </WalletOption>
      </Box>
    )
  }, [metamaskStatus, xdefiStatus, handleChainSelect])

  const renderChainSelectPanel = useMemo(() => {
    if (
      walletMode === WalletMode.Create ||
      walletMode === WalletMode.Select ||
      walletMode === WalletMode.Phrase
    )
      return <></>

    return (
      <Box className="w-full space-y-3" col>
        {availableChainsByWallet[walletMode].map((chain) => {
          return (
            <ChainOption key={chain}>
              <AssetIcon asset={chainToSigAsset(chain)} />
              <Typography>{chain}</Typography>
            </ChainOption>
          )
        })}
      </Box>
    )
  }, [walletMode])

  return (
    <Modal
      title={modalTitle}
      isOpened={isConnectModalOpen}
      withBody={false}
      onClose={handleCloseModal}
    >
      <Card className="w-[85vw] max-w-[420px] md:w-[65vw]" stretch size="lg">
        {walletStage === WalletStage.WalletSelect && renderMainPanel}
        {walletStage === WalletStage.ChainSelect && renderChainSelectPanel}
      </Card>
    </Modal>
  )
}
