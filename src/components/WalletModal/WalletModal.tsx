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
import { Input } from 'components/Input'
import { Scrollbar } from 'components/Scrollbar'
import { showToast, ToastType } from 'components/Toast'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { useWallet } from 'store/wallet/hooks'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { metamask } from 'services/metamask'
import { xdefi } from 'services/xdefi'

import { ChainOption } from './ChainOption'
import { ConnectKeystoreView } from './ConnectKeystore'
import { CreateKeystoreView } from './CreateKeystore'
import { PhraseView } from './Phrase'
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
    installTerraWallet,
    connectTerraWallet,
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

  const handleBack = useCallback(() => {
    if (walletStage === WalletStage.Final) {
      if (walletMode === WalletMode.Create || walletMode === WalletMode.Phrase)
        setWalletStage(WalletStage.WalletSelect)
      else setWalletStage(WalletStage.ChainSelect)
    } else if (walletStage === WalletStage.ChainSelect)
      setWalletStage(WalletStage.WalletSelect)
  }, [walletMode, walletStage])

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
        showToast({ message: t('notification.trustFailed') }, ToastType.Error)
      }
      clearStatus()
    },
    [connectTrustWallet, clearStatus],
  )

  const handleConnectLedger = useCallback(
    async (chain: Chain, index: number) => {
      try {
        showToast({
          message: t('notification.connectingLedger', {
            chain,
            index,
          }),
        })
        await connectLedger(chain, index)
      } catch (error) {
        showToast(
          {
            message: t('notification.ledgerFailed', {
              chain,
              index,
            }),
          },
          ToastType.Error,
        )
      }
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
              connectTerraWallet(TerraConnectType.EXTENSION)
            } catch (error) {
              console.log(error)
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

  const toggleChains = useCallback(() => {
    setPendingChains(
      pendingChains.length > 0 ? [] : availableChainsByWallet[walletMode],
    )
  }, [pendingChains.length, walletMode])

  const handleCloseModal = useCallback(() => {
    clearStatus()
  }, [clearStatus])

  const renderMainPanel = useMemo(() => {
    return (
      <Scrollbar maxHeight="60vh" customStyle={{ marginRight: '-12px' }}>
        <Box className="w-full pr-3 space-y-3" col>
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
          <WalletOption
            onClick={() => handleChainSelect(WalletMode.TrustWallet)}
          >
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
            <Icon name="plusCircle" />
          </WalletOption>
          <WalletOption onClick={() => handleChainSelect(WalletMode.Phrase)}>
            <Typography>{t('views.walletModal.importPhrase')}</Typography>
            <Icon name="import" />
          </WalletOption>
        </Box>
      </Scrollbar>
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

    const allSelected =
      pendingChains?.length === availableChainsByWallet[walletMode]?.length

    return (
      <Box className="w-full space-y-3" col>
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
        <Scrollbar maxHeight="60vh" customStyle={{ marginRight: '-12px' }}>
          <Box className="flex-1 gap-2 pr-3" col>
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
                loading={walletLoading}
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
      </Card>
    </Modal>
  )
}
