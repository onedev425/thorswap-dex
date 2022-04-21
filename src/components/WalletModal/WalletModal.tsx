import { useCallback, useEffect, useMemo, useState } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import {
  chainToSigAsset,
  MetaMaskWalletStatus,
  SupportedChain,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-sdk'
import { Keystore as KeystoreType } from '@thorswap-lib/xchain-crypto'
import { Chain, TERRAChain } from '@thorswap-lib/xchain-util'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Icon, Modal, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { Input } from 'components/Input'
import { Scrollbar } from 'components/Scrollbar'
import { showToast, ToastType } from 'components/Toast'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { useWallet } from 'store/wallet/hooks'

import usePrevious from 'hooks/usePrevious'
import { useTerraWallet } from 'hooks/useTerraWallet'
import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { xdefi } from 'services/xdefi'

import { getFromStorage } from 'helpers/storage'

import { ChainOption } from './ChainOption'
import { ConnectKeystoreView } from './ConnectKeystore'
import { CreateKeystoreView } from './CreateKeystore'
import { PhraseView } from './Phrase'
import { WalletMode, WalletStage, availableChainsByWallet } from './types'
import { WalletOption } from './WalletOption'

export const WalletModal = () => {
  const { isMdActive } = useWindowSize()
  const [walletMode, setWalletMode] = useState<WalletMode>(WalletMode.Select)
  const [walletStage, setWalletStage] = useState<WalletStage>(
    WalletStage.WalletSelect,
  )
  const [pendingChains, setPendingChains] = useState<SupportedChain[]>([])
  const [ledgerIndex, setLedgerIndex] = useState(0)

  const {
    isConnectModalOpen,
    isWalletLoading,
    wallet,
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
    isTerraWalletConnected,
    installTerraWallet,
    connectTerraWallet,
  } = useTerraWallet()

  const isTerraWalletConnectedPrevState = usePrevious(isTerraWalletConnected)

  const metamaskStatus = useMemo(() => metamask.isWalletDetected(), [])
  const xdefiStatus = useMemo(() => xdefi.isWalletDetected(), [])
  const modalTitle = useMemo(() => {
    if (walletStage === WalletStage.WalletSelect)
      return t('views.walletModal.connectWallet')

    if (walletStage === WalletStage.ChainSelect)
      return t('views.walletModal.selectChain')

    if (walletStage === WalletStage.Final) {
      if (walletMode === WalletMode.Create)
        return t('views.walletModal.createKeystore')

      if (walletMode === WalletMode.Keystore)
        return t('views.walletModal.connectKeystore')

      if (walletMode === WalletMode.Phrase)
        return t('views.walletModal.importPhrase')
    }

    return t('views.walletModal.connectWallet')
  }, [walletMode, walletStage])

  const clearStatus = useCallback(() => {
    setIsConnectModalOpen(false)

    // init all states after closing modal
    setTimeout(() => {
      setPendingChains([])
      setWalletMode(WalletMode.Select)
      setWalletStage(WalletStage.WalletSelect)
    }, 1000)
  }, [setIsConnectModalOpen])

  useEffect(() => {
    if (isConnectModalOpen) setWalletMode(WalletMode.Select)
  }, [isConnectModalOpen])

  // connect terra station wallet in the multichain sdk after wallet connection status is updated
  useEffect(() => {
    if (
      !isTerraWalletConnectedPrevState &&
      isTerraWalletConnected &&
      isConnectModalOpen
    ) {
      const activeTerraSession = getFromStorage('terraWalletSession')

      if (activeTerraSession)
        connectTerraStation(
          TerraConnectType.EXTENSION,
          activeTerraSession as string,
        )

      // close modal
      clearStatus()
    }
  }, [
    isTerraWalletConnectedPrevState,
    isTerraWalletConnected,
    connectTerraStation,
    isConnectModalOpen,
    clearStatus,
    walletMode,
  ])

  const handleBack = useCallback(() => {
    switch (walletStage) {
      case WalletStage.Final:
        return setWalletStage(
          walletMode === WalletMode.Create || walletMode === WalletMode.Phrase
            ? WalletStage.WalletSelect
            : WalletStage.ChainSelect,
        )

      case WalletStage.ChainSelect:
        return setWalletStage(WalletStage.WalletSelect)
    }
  }, [walletMode, walletStage])

  const handleConnectTerraWallet = useCallback(
    (connectType: TerraConnectType, identifier?: string) => {
      connectTerraStation(connectType, identifier)
      clearStatus()
    },
    [clearStatus, connectTerraStation],
  )

  const handleConnectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      try {
        await connectTrustWallet(chains)
      } catch (error) {
        showToast({ message: t('notification.trustFailed') }, ToastType.Error)
      }
      clearStatus()
    },
    [connectTrustWallet, clearStatus],
  )

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
      showToast({ message: t('notification.metamaskFailed') }, ToastType.Error)
    }

    clearStatus()
  }, [connectMetamask, clearStatus])

  const handleConnectXdefi = useCallback(
    async (chains: SupportedChain[]) => {
      if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
        window.open('https://xdefi.io')
      } else if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
        showToast(
          {
            message: t('notification.prioritisationError'),
            description: t('notification.xdefiPrioritise'),
          },
          ToastType.Error,
        )
      } else {
        try {
          // connect Xdefi Terra
          if (chains.includes(TERRAChain) && !!window.xfi.terra) {
            try {
              connectTerraWallet(TerraConnectType.EXTENSION, 'xdefi-wallet')
            } catch (error) {
              console.error(error)
            }
          }

          await connectXdefiWallet(chains)
        } catch (error) {
          showToast({ message: t('notification.xdefiFailed') }, ToastType.Error)
        }
        clearStatus()
      }
    },
    [xdefiStatus, clearStatus, connectXdefiWallet, connectTerraWallet],
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
          showToast(
            {
              message: t('notification.prioritisationError'),
              description: t('notification.xdefiPrioritise'),
            },
            ToastType.Error,
          )
          return
        }
      }

      if (selectedWallet === WalletMode.MetaMask) {
        if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
          window.open('https://metamask.io')
          return
        }

        if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
          showToast(
            {
              message: t('notification.prioritisationError'),
              description: t('notification.xdefiDeprioritise'),
            },
            ToastType.Error,
          )
          return
        }
      }

      // install or connect terra wallet
      if (selectedWallet === WalletMode.Terra) {
        if (!isTerraStationInstalled) {
          installTerraWallet(TerraConnectType.EXTENSION)
        } else {
          handleConnectTerraWallet(TerraConnectType.EXTENSION, 'station')
        }

        return
      }

      // terra station mobile
      if (selectedWallet === WalletMode.TerraMobile) {
        handleConnectTerraWallet(TerraConnectType.WALLETCONNECT)
        // close modal
        clearStatus()
        return
      }

      setWalletMode(selectedWallet)

      if (
        [
          WalletMode.TrustWallet,
          WalletMode.Xdefi,
          WalletMode.Ledger,
          WalletMode.Keystore,
          WalletMode.MetaMask,
        ].includes(selectedWallet)
      ) {
        setWalletStage(WalletStage.ChainSelect)

        setPendingChains(
          selectedWallet === WalletMode.Ledger
            ? [Chain.Bitcoin]
            : availableChainsByWallet[selectedWallet],
        )
      } else {
        setWalletStage(WalletStage.Final)
      }
    },
    [
      isTerraStationInstalled,
      metamaskStatus,
      xdefiStatus,
      clearStatus,
      handleConnectTerraWallet,
      installTerraWallet,
    ],
  )

  const handleConnectWallet = useCallback(() => {
    switch (walletMode) {
      case WalletMode.TrustWallet:
        return handleConnectTrustWallet(pendingChains)

      case WalletMode.Keystore:
        return setWalletStage(WalletStage.Final)

      case WalletMode.Xdefi:
        return handleConnectXdefi(pendingChains)

      case WalletMode.Ledger:
        return handleConnectLedger(pendingChains[0], ledgerIndex)

      case WalletMode.MetaMask:
        return handleConnectMetaMask()
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

      const newPendingChains = pendingChains.includes(chain)
        ? pendingChains.filter((item) => item !== chain)
        : [...pendingChains, chain]

      setPendingChains(newPendingChains)
    },
    [pendingChains, walletMode],
  )

  const toggleChains = useCallback(() => {
    setPendingChains(
      pendingChains.length > 0 ? [] : availableChainsByWallet[walletMode],
    )
  }, [pendingChains.length, walletMode])

  const handleCloseModal = useCallback(() => {
    clearStatus()
  }, [clearStatus])

  const xdefiLabel = useMemo(() => {
    switch (xdefiStatus) {
      case XdefiWalletStatus.XdefiPrioritized:
        return t('views.walletModal.connectXdefi')
      case XdefiWalletStatus.XdefiNotPrioritized:
        return t('views.walletModal.prioritiseXdefi')
      case XdefiWalletStatus.XdefiNotInstalled:
        return t('views.walletModal.installXdefi')
    }
  }, [xdefiStatus])

  const metamaskLabel = useMemo(() => {
    switch (metamaskStatus) {
      case MetaMaskWalletStatus.NoWeb3Provider:
        return t('views.walletModal.installMetaMask')
      case MetaMaskWalletStatus.XdefiDetected:
        return t('views.walletModal.disableXdefi')
      case MetaMaskWalletStatus.MetaMaskDetected:
        return t('views.walletModal.connectMetaMask')
    }
  }, [metamaskStatus])

  // TODO(@Chillios): Refactor
  const renderMainPanel = useMemo(() => {
    return (
      <Scrollbar maxHeight="60vh" customStyle={{ marginRight: '-12px' }}>
        <Box className="w-full space-y-2" col>
          {isMdActive && (
            <>
              <WalletOption onClick={() => handleChainSelect(WalletMode.Xdefi)}>
                <Typography>{xdefiLabel}</Typography>
                <Icon name="xdefi" />
              </WalletOption>

              {isTerraStationAvailable && (
                <WalletOption
                  onClick={() => handleChainSelect(WalletMode.Terra)}
                >
                  <Typography>
                    {isTerraStationInstalled
                      ? t('views.walletModal.connectStation')
                      : t('views.walletModal.installStation')}
                  </Typography>
                  <Icon name="station" />
                </WalletOption>
              )}
            </>
          )}

          <WalletOption
            onClick={() => handleChainSelect(WalletMode.TerraMobile)}
          >
            <Typography>{t('views.walletModal.connectTerraMobile')}</Typography>
            <Icon name="terra" />
          </WalletOption>
          <WalletOption
            onClick={() => handleChainSelect(WalletMode.TrustWallet)}
          >
            <Typography>{t('views.walletModal.walletConnect')}</Typography>
            <Icon name="walletConnect" />
          </WalletOption>
          <WalletOption onClick={() => handleChainSelect(WalletMode.MetaMask)}>
            <Typography>{metamaskLabel}</Typography>
            <Icon name="metamask" />
          </WalletOption>

          {isMdActive && (
            <WalletOption onClick={() => handleChainSelect(WalletMode.Ledger)}>
              <Typography>{t('views.walletModal.connectLedger')}</Typography>
              <Icon name="ledger" />
            </WalletOption>
          )}

          <WalletOption onClick={() => handleChainSelect(WalletMode.Keystore)}>
            <Typography>{t('views.walletModal.connectKeystore')}</Typography>
            <Icon name="keystore" />
          </WalletOption>

          {isMdActive && (
            <>
              <WalletOption
                onClick={() => handleChainSelect(WalletMode.Create)}
              >
                <Typography>{t('views.walletModal.createKeystore')}</Typography>
                <Icon name="plusCircle" />
              </WalletOption>

              <WalletOption
                onClick={() => handleChainSelect(WalletMode.Phrase)}
              >
                <Typography>{t('views.walletModal.importPhrase')}</Typography>
                <Icon name="import" />
              </WalletOption>
            </>
          )}
        </Box>
      </Scrollbar>
    )
  }, [
    isMdActive,
    xdefiLabel,
    isTerraStationAvailable,
    isTerraStationInstalled,
    metamaskLabel,
    handleChainSelect,
  ])

  const renderChainSelectPanel = useMemo(() => {
    if (
      walletMode === WalletMode.Create ||
      walletMode === WalletMode.Select ||
      walletMode === WalletMode.Phrase
    ) {
      return <></>
    }

    const allSelected =
      pendingChains?.length === availableChainsByWallet[walletMode]?.length

    return (
      <Box className="w-full space-y-2" col>
        {walletMode !== WalletMode.Ledger &&
          availableChainsByWallet[walletMode].length > 0 && (
            <Box row justify="end">
              <Button
                type="borderless"
                variant="tint"
                endIcon={
                  <Icon
                    name="selectAll"
                    color={allSelected ? 'primaryBtn' : 'primary'}
                  />
                }
                onClick={toggleChains}
              >
                {t('views.walletModal.selectAll')}
              </Button>
            </Box>
          )}

        <Scrollbar maxHeight="100%" customStyle={{ marginRight: '-12px' }}>
          <Box className="flex-1 gap-2" col>
            {availableChainsByWallet[walletMode].map((chain) => {
              const chainWallet = wallet?.[chain]
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
                      {chainWallet ? (
                        <Box className="space-x-1" alignCenter row>
                          <Typography
                            variant="caption-xs"
                            color="primary"
                            fontWeight="normal"
                          >
                            {t('views.walletModal.connectedWith')}
                          </Typography>
                          <WalletIcon
                            size={16}
                            walletType={chainWallet.walletType}
                          />
                        </Box>
                      ) : (
                        <Typography variant="caption-xs" fontWeight="normal">
                          {t('views.walletModal.notConnected')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {isChainSelected ? (
                    <Icon name="checkmark" color="primaryBtn" size={20} />
                  ) : null}
                </ChainOption>
              )
            })}
          </Box>
        </Scrollbar>

        {walletMode === WalletMode.Ledger && (
          <Box alignCenter justify="between">
            <Typography>{t('views.walletModal.ledgerIndex')}:</Typography>
            <Input
              border="rounded"
              type="number"
              value={ledgerIndex}
              onChange={(e) => setLedgerIndex(parseInt(e.target.value))}
            />
          </Box>
        )}

        <Box className="w-full" alignCenter justifyCenter>
          <Button
            className="w-3/4 mt-2"
            isFancy
            size="md"
            error={pendingChains.length === 0}
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
    wallet,
    walletMode,
    handleConnectWallet,
    handlePendingChain,
    toggleChains,
  ])

  return (
    <Modal
      title={modalTitle}
      isOpened={isConnectModalOpen}
      withBody={false}
      onClose={handleCloseModal}
      onBack={walletStage !== WalletStage.WalletSelect ? handleBack : undefined}
    >
      <Card
        className="w-[85vw] !py-6 max-w-[420px] md:w-[65vw] h-fit"
        stretch
        size="lg"
      >
        <Box className="w-full" col>
          {walletStage === WalletStage.ChainSelect &&
            walletMode === WalletMode.Ledger && (
              <InfoTip
                className="!mb-4"
                content="Make sure your Ledger is unlocked and you have opened the app you would like to connect before proceeding"
                title="Unlock Ledger and open App"
                type="warn"
              />
            )}

          {walletStage === WalletStage.WalletSelect && renderMainPanel}

          {walletStage === WalletStage.ChainSelect && renderChainSelectPanel}

          {walletStage === WalletStage.Final && (
            <>
              {walletMode === WalletMode.Keystore && (
                <ConnectKeystoreView
                  loading={isWalletLoading}
                  onConnect={handleConnect}
                  onCreate={() => setWalletMode(WalletMode.Create)}
                />
              )}
              {walletMode === WalletMode.Create && (
                <CreateKeystoreView
                  onConnect={handleConnect}
                  onKeystore={() => setWalletMode(WalletMode.Keystore)}
                />
              )}
              {walletMode === WalletMode.Phrase && <PhraseView />}
            </>
          )}
        </Box>
      </Card>
    </Modal>
  )
}
