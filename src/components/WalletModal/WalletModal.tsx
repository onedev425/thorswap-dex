import { useCallback, useEffect, useMemo, useState } from 'react'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Keystore as KeystoreType } from '@thorswap-lib/xchain-crypto'
import classNames from 'classnames'

import { Box, Card, Modal } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { ChainSelect } from 'components/WalletModal/ChainSelect'
import { WalletTypes } from 'components/WalletModal/WalletTypes'

import { useWallet } from 'store/wallet/hooks'

import usePrevious from 'hooks/usePrevious'
import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'

import { getFromStorage } from 'helpers/storage'

import { ConnectKeystoreView } from './ConnectKeystore'
import { CreateKeystoreView } from './CreateKeystore'
import { PhraseView } from './Phrase'
import { WalletType, WalletStage } from './types'

export const WalletModal = () => {
  const [walletType, setWalletType] = useState<WalletType>(WalletType.Select)
  const [walletStage, setWalletStage] = useState<WalletStage>(
    WalletStage.WalletSelect,
  )
  const [pendingChains, setPendingChains] = useState<SupportedChain[]>([])
  const [ledgerIndex, setLedgerIndex] = useState(0)

  const {
    isConnectModalOpen,
    isWalletLoading,
    unlockWallet,
    connectTerraStation,
    setIsConnectModalOpen,
  } = useWallet()

  const { isTerraWalletConnected } = useTerraWallet()
  const isTerraWalletConnectedPrevState = usePrevious(isTerraWalletConnected)

  const modalTitle = useMemo(() => {
    switch (walletStage) {
      case WalletStage.WalletSelect:
        return t('views.walletModal.connectWallet')
      case WalletStage.ChainSelect:
        return t('views.walletModal.selectChain')

      case WalletStage.Final:
        switch (walletType) {
          case WalletType.CreateKeystore:
            return t('views.walletModal.createKeystore')
          case WalletType.Keystore:
            return t('views.walletModal.keystore')
          case WalletType.Phrase:
            return t('views.walletModal.importPhrase')

          default:
            return t('views.walletModal.connectWallet')
        }
    }
  }, [walletType, walletStage])

  const clearStatus = useCallback(() => {
    setIsConnectModalOpen(false)

    // init all states after closing modal
    setTimeout(() => {
      setPendingChains([])
      setWalletType(WalletType.Select)
      setWalletStage(WalletStage.WalletSelect)
    }, 1000)
  }, [setIsConnectModalOpen])

  useEffect(() => {
    if (isConnectModalOpen) {
      setWalletType(WalletType.Select)
    }
  }, [isConnectModalOpen])

  // connect terra station wallet in the multichain sdk after wallet connection status is updated
  useEffect(() => {
    if (
      !isTerraWalletConnectedPrevState &&
      isTerraWalletConnected &&
      isConnectModalOpen
    ) {
      const activeTerraSession = getFromStorage('terraWalletSession')

      if (activeTerraSession) {
        connectTerraStation(
          TerraConnectType.EXTENSION,
          activeTerraSession as string,
        )
      }

      // close modal
      clearStatus()
    }
  }, [
    isTerraWalletConnectedPrevState,
    isTerraWalletConnected,
    connectTerraStation,
    isConnectModalOpen,
    clearStatus,
    walletType,
  ])

  const handleBack = useCallback(() => {
    const nextWalletStage =
      walletStage === WalletStage.ChainSelect ||
      (walletStage === WalletStage.Final &&
        [WalletType.CreateKeystore, WalletType.Phrase].includes(walletType))
        ? WalletStage.WalletSelect
        : WalletStage.ChainSelect

    setWalletStage(nextWalletStage)
  }, [walletType, walletStage])

  const handleConnect = useCallback(
    async (keystore: KeystoreType, phrase: string) => {
      await unlockWallet(keystore, phrase, pendingChains)

      clearStatus()
    },
    [pendingChains, clearStatus, unlockWallet],
  )

  const handleCloseModal = useCallback(() => {
    clearStatus()
  }, [clearStatus])

  return (
    <Modal
      title={modalTitle}
      isOpened={isConnectModalOpen}
      withBody={false}
      onClose={handleCloseModal}
      onBack={walletStage !== WalletStage.WalletSelect ? handleBack : undefined}
    >
      <Card
        className={classNames(
          'w-[95vw] !px-0 py-8 md:max-w-[500px] md:w-[75vw] h-fit',
          { '!py-4': walletStage === WalletStage.ChainSelect },
        )}
        stretch
        size="lg"
      >
        <Box className="w-full" col>
          {walletStage === WalletStage.ChainSelect &&
            walletType === WalletType.Ledger && (
              <InfoTip
                className="!mb-4 !mx-6"
                content="Make sure your Ledger is unlocked and you have opened the app you would like to connect before proceeding"
                title="Unlock Ledger and open App"
                type="warn"
              />
            )}

          {walletStage === WalletStage.WalletSelect && (
            <WalletTypes
              clearStatus={clearStatus}
              setPendingChains={setPendingChains}
              setWalletStage={setWalletStage}
              setWalletType={setWalletType}
            />
          )}

          {walletStage === WalletStage.ChainSelect && (
            <ChainSelect
              clearStatus={clearStatus}
              ledgerIndex={ledgerIndex}
              setLedgerIndex={setLedgerIndex}
              setWalletStage={setWalletStage}
              setPendingChains={setPendingChains}
              pendingChains={pendingChains}
              walletType={walletType}
            />
          )}

          {walletStage === WalletStage.Final && (
            <Box className="px-6">
              {walletType === WalletType.Keystore && (
                <ConnectKeystoreView
                  loading={isWalletLoading}
                  onConnect={handleConnect}
                  onCreate={() => setWalletType(WalletType.CreateKeystore)}
                />
              )}
              {walletType === WalletType.CreateKeystore && (
                <CreateKeystoreView
                  onConnect={handleConnect}
                  onKeystore={() => setWalletType(WalletType.Keystore)}
                />
              )}

              {walletType === WalletType.Phrase && <PhraseView />}
            </Box>
          )}
        </Box>
      </Card>
    </Modal>
  )
}
