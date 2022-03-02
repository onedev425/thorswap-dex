import { useCallback, useEffect, useMemo, useState } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import {
  chainToSigAsset,
  MetaMaskWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Keystore as KeystoreType } from '@thorswap-lib/xchain-crypto'
import { Chain } from '@thorswap-lib/xchain-util'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Icon, Modal, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { useWallet } from 'redux/wallet/hooks'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { xdefi } from 'services/xdefi'

import { ChainOption } from './ChainOption'
import { KeystoreView as ConnectKeystoreView } from './ConnectKeystore'
import { WalletMode, WalletStage, availableChainsByWallet } from './types'
import { WalletOption } from './WalletOption'

export const WalletModal = () => {
  const [walletMode, setWalletMode] = useState<WalletMode>(WalletMode.Select)
  const [walletStage, setWalletStage] = useState<WalletStage>(
    WalletStage.WalletSelect,
  )
  const [pendingChains, setPendingChains] = useState<SupportedChain[]>([])
  const [ledgerIndex, setLedgerIndex] = useState(0)

  const {
    isConnectModalOpen,
    walletLoading,
    unlockWallet,
    connectXdefiWallet,
    connectMetamask,
    connectTrustWallet,
    connectLedger,
    connectTerraStation,
    setIsConnectModalOpen,
  } = useWallet()

  const {
    isTerraStationAvailable,
    isTerraStationInstalled,
    installTerraWallet,
  } = useTerraWallet()

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

  const clearStatus = useCallback(() => {
    setIsConnectModalOpen(false)

    // init all states after closing modal
    setTimeout(() => {
      setPendingChains([])
      setWalletMode(WalletMode.Select)
      setWalletStage(WalletStage.WalletSelect)
    }, 1000)
  }, [setIsConnectModalOpen])

  const handleBack = useCallback(() => {
    if (walletStage === WalletStage.Final)
      setWalletStage(WalletStage.ChainSelect)
    else if (walletStage === WalletStage.ChainSelect)
      setWalletStage(WalletStage.WalletSelect)
  }, [walletStage])

  const handleConnectTerraWallet = useCallback(() => {
    connectTerraStation()
    // close modal
    clearStatus()
  }, [clearStatus, connectTerraStation])

  const handleConnectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      try {
        await connectTrustWallet(chains)
      } catch (error) {
        // TODO: show notification about error
        console.log(error)
      }
      clearStatus()
    },
    [connectTrustWallet, clearStatus],
  )

  const handleConnectLedger = useCallback(
    async (chain: Chain, index: number) => {
      try {
        // TODO: show connecting progress: `Connecting ${chainName} Ledger #...`
        await connectLedger(chain, index)
      } catch (error) {
        // TODO: show error
        console.error(error)
      }
      clearStatus()
    },
    [connectLedger, clearStatus],
  )

  const handleConnectMetaMask = useCallback(async () => {
    if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
      window.open('https://metamask.io')
    } else if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
      // TODO: Should disable xdefi wallet
    } else {
      try {
        await connectMetamask()
      } catch (error) {
        // TODO: show notification about error
      }

      clearStatus()
    }
  }, [metamaskStatus, connectMetamask, clearStatus])

  const handleConnectXdefi = useCallback(
    async (chains: SupportedChain[]) => {
      if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
        window.open('https://xdefi.io')
      } else if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
        // TODO: show notification to prioritise the XDEFI wallet
      } else {
        try {
          await connectXdefiWallet(chains)
        } catch (error) {
          // TODO: show notification for error while connecting the wallet
        }
        clearStatus()
      }
    },
    [xdefiStatus, clearStatus, connectXdefiWallet],
  )

  const handleConnect = useCallback(
    async (keystore: KeystoreType, phrase: string) => {
      await unlockWallet(keystore, phrase, pendingChains)

      clearStatus()
    },
    [pendingChains, clearStatus, unlockWallet],
  )

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

      // install or connect terra wallet
      if (selectedWallet === WalletMode.Terra) {
        if (!isTerraStationInstalled) {
          installTerraWallet(TerraConnectType.EXTENSION)
        } else {
          handleConnectTerraWallet()
        }

        return
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
    [
      isTerraStationInstalled,
      metamaskStatus,
      xdefiStatus,
      handleConnectTerraWallet,
      installTerraWallet,
    ],
  )

  const handleConnectWallet = useCallback(() => {
    if (walletMode === WalletMode.TrustWallet) {
      handleConnectTrustWallet(pendingChains)
    } else if (walletMode === WalletMode.Keystore) {
      setWalletStage(WalletStage.Final)
    } else if (walletMode === WalletMode.Xdefi) {
      handleConnectXdefi(pendingChains)
    } else if (walletMode === WalletMode.Ledger) {
      handleConnectLedger(pendingChains[0], ledgerIndex)
    } else if (walletMode === WalletMode.MetaMask) {
      handleConnectMetaMask()
    }
  }, [
    ledgerIndex,
    pendingChains,
    walletMode,
    handleConnectLedger,
    handleConnectMetaMask,
    handleConnectTrustWallet,
    handleConnectXdefi,
  ])

  const handlePendingChain = useCallback(
    (chain: SupportedChain) => {
      if (walletMode === WalletMode.Ledger) {
        setPendingChains([chain])
        return
      }

      if (pendingChains.includes(chain)) {
        const newPendingChains = pendingChains.filter((item) => item !== chain)
        setPendingChains(newPendingChains)
      } else {
        setPendingChains([...pendingChains, chain])
      }
    },
    [pendingChains, walletMode],
  )

  const handleCloseModal = useCallback(() => {
    clearStatus()
  }, [clearStatus])

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
        {isTerraStationAvailable && (
          <WalletOption onClick={() => handleChainSelect(WalletMode.Terra)}>
            {isTerraStationInstalled && (
              <Typography>{t('views.walletModal.connectStation')}</Typography>
            )}
            {!isTerraStationInstalled && (
              <Typography>{t('views.walletModal.installStation')}</Typography>
            )}
            <Icon name="station" />
          </WalletOption>
        )}
        <WalletOption onClick={() => handleChainSelect(WalletMode.TrustWallet)}>
          <Typography>{t('views.walletModal.walletConnect')}</Typography>
          <Icon name="walletConnect" />
        </WalletOption>
        <WalletOption onClick={() => handleChainSelect(WalletMode.MetaMask)}>
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
        <WalletOption onClick={() => handleChainSelect(WalletMode.Ledger)}>
          <Typography>{t('views.walletModal.connectLedger')}</Typography>
          <Icon name="ledger" />
        </WalletOption>
        <WalletOption onClick={() => handleChainSelect(WalletMode.Keystore)}>
          <Typography>{t('views.walletModal.connectKeystore')}</Typography>
          <Icon name="keystore" />
        </WalletOption>
        <WalletOption onClick={() => handleChainSelect(WalletMode.Create)}>
          <Typography>{t('views.walletModal.createKeystore')}</Typography>
          <Icon name="plus" />
        </WalletOption>
        <WalletOption onClick={() => handleChainSelect(WalletMode.Phrase)}>
          <Typography>{t('views.walletModal.importPhrase')}</Typography>
          <Icon name="import" />
        </WalletOption>
      </Box>
    )
  }, [
    isTerraStationAvailable,
    isTerraStationInstalled,
    metamaskStatus,
    xdefiStatus,
    handleChainSelect,
  ])

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
          const isChainSelected = pendingChains.includes(chain)

          return (
            <ChainOption
              key={chain}
              isSelected={isChainSelected}
              onClick={() => handlePendingChain(chain)}
            >
              <Box row>
                <AssetIcon asset={chainToSigAsset(chain)} />
                <Box className="pl-2" col>
                  <Typography>{chain}</Typography>
                  <Typography variant="caption-xs">Not Connected</Typography>
                </Box>
              </Box>
              {isChainSelected ? (
                <Icon name="checkmark" color="primaryBtn" size={20} />
              ) : null}
            </ChainOption>
          )
        })}

        {walletMode === WalletMode.Ledger && (
          <Box alignCenter justify="between">
            <Typography>{t('views.walletModal.ledgerIndex')}:</Typography>
            <Input
              border="rounded"
              type="number"
              value={ledgerIndex}
              onChange={(e) => {
                setLedgerIndex(parseInt(e.target.value))
              }}
            />
          </Box>
        )}

        <Box className="w-full" alignCenter justifyCenter>
          <Button
            className="w-1/2 mt-2"
            size="md"
            disabled={pendingChains.length === 0}
            onClick={handleConnectWallet}
          >
            {t('common.connect')}
          </Button>
        </Box>
      </Box>
    )
  }, [
    ledgerIndex,
    pendingChains,
    walletMode,
    handleConnectWallet,
    handlePendingChain,
  ])

  return (
    <Modal
      title={modalTitle}
      isOpened={isConnectModalOpen}
      withBody={false}
      onClose={handleCloseModal}
      {...(walletStage !== WalletStage.WalletSelect
        ? { onBack: handleBack }
        : {})}
    >
      <Card className="w-[85vw] max-w-[420px] md:w-[65vw]" stretch size="lg">
        {walletStage === WalletStage.WalletSelect && renderMainPanel}
        {walletStage === WalletStage.ChainSelect && renderChainSelectPanel}
        {walletStage === WalletStage.Final && (
          <>
            {walletMode === WalletMode.Keystore && (
              <ConnectKeystoreView
                isLoading={walletLoading}
                onConnect={handleConnect}
                onCreate={() => setWalletMode(WalletMode.Create)}
              />
            )}
          </>
        )}
      </Card>
    </Modal>
  )
}
