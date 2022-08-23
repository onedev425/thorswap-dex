import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { Chain, SupportedChain, SUPPORTED_CHAINS } from '@thorswap-lib/types'
import { Keystore as KeystoreType } from '@thorswap-lib/xchain-crypto'
import classNames from 'classnames'
import uniq from 'lodash/uniq'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTip } from 'components/InfoTip'
import { Input } from 'components/Input'
import { showErrorToast } from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { getFromStorage, saveInStorage } from 'helpers/storage'

import ChainItem from './ChainItem'
import { ConnectKeystoreView } from './ConnectKeystore'
import { CreateKeystoreView } from './CreateKeystore'
import {
  HandleWalletConnectParams,
  useHandleWalletConnect,
  useHandleWalletTypeSelect,
  useWalletOptions,
} from './hooks'
import { PhraseView } from './Phrase'
import { WalletType, availableChainsByWallet } from './types'
import WalletOption from './WalletOption'

const ConnectWalletModal = () => {
  const { isMdActive } = useWindowSize()
  const {
    unlockWallet,
    isWalletLoading,
    setIsConnectModalOpen,
    isConnectModalOpen,
    wallet,
  } = useWallet()
  const [selectedChains, setSelectedChains] = useState<SupportedChain[]>([])
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>()
  const [ledgerIndex, setLedgerIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [customFlow, setCustomFlow] = useState(false)
  const [saveWallet, setSaveWallet] = useState(
    getFromStorage('restorePreviousWallet') as boolean,
  )

  const supportedByWallet = useMemo(
    () =>
      availableChainsByWallet[selectedWalletType as WalletType] ||
      SUPPORTED_CHAINS.filter((c) => Chain.Avalanche !== c),
    [selectedWalletType],
  )
  const selectedAll = selectedChains?.length === supportedByWallet.length

  const handleSaveStorageChange = useCallback((value: boolean) => {
    setSaveWallet(value)
    saveInStorage({ key: 'restorePreviousWallet', value })
  }, [])

  const clearState = useCallback(
    (closeModal = true) => {
      if (closeModal) setIsConnectModalOpen(false)
      setTimeout(
        () => {
          setCustomFlow(false)
          setLedgerIndex(0)
          setLoading(false)
          setSelectedChains([])
          setSelectedWalletType(undefined)
        },
        closeModal ? 400 : 0,
      )
    },
    [setIsConnectModalOpen],
  )

  const handleWalletConnect = useHandleWalletConnect({
    ledgerIndex,
    chains: selectedChains,
    walletType: selectedWalletType,
  })

  const handleAllClick = useCallback(() => {
    if (selectedWalletType === WalletType.Ledger) return

    setSelectedChains(selectedAll ? [] : supportedByWallet)
  }, [selectedAll, selectedWalletType, supportedByWallet])

  const selectChain = useCallback(
    (chain: SupportedChain, skipReset: boolean) => () => {
      if (!skipReset) setSelectedWalletType(undefined)

      setSelectedChains((prevSelectedChains) =>
        selectedWalletType &&
        [WalletType.Ledger, WalletType.MetaMask].includes(selectedWalletType)
          ? [chain]
          : prevSelectedChains.includes(chain)
          ? prevSelectedChains.filter((c) => c !== chain)
          : [...prevSelectedChains, chain],
      )
    },
    [selectedWalletType],
  )

  const handleConnect = useCallback(
    async (keystore: KeystoreType, phrase: string) => {
      await unlockWallet(keystore, phrase, selectedChains)
      clearState()
    },
    [unlockWallet, selectedChains, clearState],
  )

  const connectWallet = useCallback(async () => {
    const keystoreOrPhrase = [
      WalletType.Keystore,
      WalletType.Phrase,
      WalletType.CreateKeystore,
    ].includes(selectedWalletType as WalletType)

    if (keystoreOrPhrase) {
      setIsConnectModalOpen(true)
      return setCustomFlow(true)
    }

    setLoading(true)

    try {
      clearState()
      await handleWalletConnect()
    } catch (error) {
      console.error(error)
      showErrorToast(`${t('txManager.failed')} ${selectedWalletType}`)
    }
  }, [
    clearState,
    handleWalletConnect,
    selectedWalletType,
    setIsConnectModalOpen,
  ])

  const handleWalletTypeSelect = useHandleWalletTypeSelect({
    setSelectedWalletType,
    setSelectedChains,
  })

  const walletOptions = useWalletOptions({ isMdActive })

  const connectedWallets = useMemo(
    () =>
      uniq(
        SUPPORTED_CHAINS.reduce((acc, chain) => {
          const { walletType } = wallet?.[chain] || {}
          if (walletType) acc.push(walletType.toLowerCase())
          return acc
        }, [] as string[]),
      ),
    [wallet],
  )

  useEffect(() => {
    const previousWallet = getFromStorage('previousWallet')
    const restorePreviousWallet = getFromStorage('restorePreviousWallet')
    if (previousWallet && restorePreviousWallet) {
      setTimeout(() => {
        handleWalletConnect(previousWallet as HandleWalletConnectParams)
      }, 1000)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const oneTimeWalletType = [
    WalletType.CreateKeystore,
    WalletType.Keystore,
    WalletType.Phrase,
    WalletType.Ledger,
    WalletType.TrustWallet,
  ].includes(selectedWalletType || WalletType.Keystore)

  const isWalletTypeDisabled = useCallback(
    (walletType: WalletType) =>
      selectedChains.length > 0
        ? !selectedChains.every((chain) =>
            availableChainsByWallet[walletType].includes(chain),
          )
        : false,
    [selectedChains],
  )

  return (
    <Modal
      HeaderComponent={
        <Box className="!h-20">
          {selectedWalletType === WalletType.Ledger && (
            <InfoTip
              contentClassName="py-0"
              className="m-auto !pt-2 !pb-1 !px-2"
              content="Make sure your Ledger is unlocked and you have opened the app you would like to connect before proceeding"
              title="Unlock Ledger and open App"
              type="warn"
            />
          )}
        </Box>
      }
      title={t('views.walletModal.connectWallets')}
      isOpened={isConnectModalOpen}
      withBody={false}
      className="md:!max-w-[600px] -mt-24"
      onClose={clearState}
      onBack={customFlow ? () => setCustomFlow(false) : undefined}
    >
      <Box
        col
        className={classNames(
          'bg-light-layout-primary dark:bg-dark-bg-secondary rounded-3xl !p-0 md:max-w-[600px] h-fit',
          { '!px-2 !py-4': customFlow },
        )}
        justify="between"
      >
        {customFlow ? (
          <Box className="w-[360px] px-6">
            {selectedWalletType === WalletType.Keystore && (
              <ConnectKeystoreView
                loading={isWalletLoading}
                onConnect={handleConnect}
                onCreate={() =>
                  setSelectedWalletType(WalletType.CreateKeystore)
                }
              />
            )}
            {selectedWalletType === WalletType.CreateKeystore && (
              <CreateKeystoreView
                onConnect={handleConnect}
                onKeystore={() => setSelectedWalletType(WalletType.Keystore)}
              />
            )}

            {selectedWalletType === WalletType.Phrase && <PhraseView />}
          </Box>
        ) : (
          <Box col={!isMdActive}>
            <Box
              col
              alignCenter
              className={classNames(
                'bg-light-bg-primary dark:bg-dark-bg-primary',
                'md:px-6 pb-10 dark:drop-shadow-4xl z-10',
                isMdActive ? 'rounded-l-3xl' : 'rounded-t-3xl',
              )}
            >
              <Box
                col={isMdActive}
                alignCenter
                className="p-4 w-[90%] md:gap-4 md:pt-4 "
              >
                <Box flex={1}>
                  <Typography variant={isMdActive ? 'h4' : 'subtitle2'}>
                    {t('views.walletModal.selectChains')}
                  </Typography>
                </Box>

                <Button
                  size="sm"
                  className="!h-5 !px-1.5 justify-end"
                  disabled={[WalletType.Ledger, WalletType.MetaMask].includes(
                    selectedWalletType || WalletType.Keystore,
                  )}
                  type={selectedAll ? 'default' : 'outline'}
                  variant="primary"
                  transform="uppercase"
                  onClick={handleAllClick}
                >
                  <Typography variant="caption">
                    {t('views.walletModal.selectAll')}
                  </Typography>
                </Button>
              </Box>

              <Box className="flex-wrap md:w-36">
                {SUPPORTED_CHAINS.map((chain) => (
                  <ChainItem
                    disabled={[Chain.Avalanche].includes(chain)}
                    key={chain}
                    onClick={selectChain}
                    isChainAvailable={availableChainsByWallet[
                      selectedWalletType as WalletType
                    ]?.includes(chain)}
                    selectedWalletType={selectedWalletType}
                    selected={selectedChains.includes(chain)}
                    walletType={wallet?.[chain]?.walletType}
                    chain={chain}
                  />
                ))}
              </Box>
            </Box>

            <Box flex={1} col>
              <Box alignCenter className="pr-4 md:pr-10 px-4">
                <Box flex={1}>
                  <Typography
                    variant={isMdActive ? 'h4' : 'subtitle2'}
                    className="py-4"
                  >
                    {t('views.walletModal.selectWallet')}
                  </Typography>
                </Box>

                <Box alignCenter className="gap-x-2">
                  {!oneTimeWalletType && (
                    <HoverIcon
                      size={20}
                      onClick={() => handleSaveStorageChange(!saveWallet)}
                      tooltip={t('views.walletModal.keepWalletConnected')}
                      color={saveWallet ? 'cyan' : 'secondary'}
                      iconName={saveWallet ? 'saveFill' : 'save'}
                    />
                  )}

                  <Button
                    className="!h-5 !px-1.5 justify-end"
                    type="outline"
                    variant="primary"
                    transform="uppercase"
                    onClick={() => clearState(false)}
                  >
                    <Typography variant="caption">
                      {t('common.reset')}
                    </Typography>
                  </Button>
                </Box>
              </Box>

              <Box className="pl-6 pr-4 flex-wrap">
                {walletOptions.map(
                  ({ visible = true, type, disabled, icon, label }) =>
                    visible && (
                      <WalletOption
                        icon={icon}
                        label={label}
                        key={type}
                        type={type}
                        disabled={disabled || isWalletTypeDisabled(type)}
                        selected={type === selectedWalletType}
                        connected={connectedWallets.includes(
                          type.toLowerCase(),
                        )}
                        handleTypeSelect={handleWalletTypeSelect}
                      />
                    ),
                )}
              </Box>

              {selectedWalletType === WalletType.Ledger && (
                <Box
                  flex={1}
                  alignCenter
                  justify="between"
                  className="py-2 px-6 gap-2 p-1 gap-x-2"
                >
                  <Typography>{t('common.index')}:</Typography>
                  <Input
                    border="rounded"
                    type="number"
                    value={ledgerIndex}
                    onChange={(e) => setLedgerIndex(parseInt(e.target.value))}
                  />
                </Box>
              )}

              {!customFlow && (
                <Box
                  flex={1}
                  col
                  justify="end"
                  className="pb-0.5 pt-4 md:pt-0 mb-8"
                >
                  <Button
                    disabled={!selectedWalletType || !selectedChains.length}
                    loading={loading}
                    onClick={connectWallet}
                    className="w-2/3 self-center"
                    size="md"
                    isFancy
                  >
                    <Typography>{t('common.connectWallet')}</Typography>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  )
}

export default memo(ConnectWalletModal)
