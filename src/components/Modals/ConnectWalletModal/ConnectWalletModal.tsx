import { Keystore, SUPPORTED_CHAINS, SupportedChain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Button, Modal, Tooltip, Typography } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTip } from 'components/InfoTip';
import { Input } from 'components/Input';
import { DerivationPathDropdown } from 'components/Modals/ConnectWalletModal/DerivationPathsDropdown';
import { showErrorToast } from 'components/Toast';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import useWindowSize from 'hooks/useWindowSize';
import uniq from 'lodash/uniq';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

import ChainItem from './ChainItem';
import { ConnectKeystoreView } from './ConnectKeystore';
import { CreateKeystoreView } from './CreateKeystore';
import {
  HandleWalletConnectParams,
  useHandleWalletConnect,
  useHandleWalletTypeSelect,
  useWalletOptions,
} from './hooks';
import { PhraseView } from './Phrase';
import { availableChainsByWallet, WalletType } from './types';
import WalletOption from './WalletOption';

const ConnectWalletModal = () => {
  const { isMdActive } = useWindowSize();
  const { unlockWallet, isWalletLoading, setIsConnectModalOpen, isConnectModalOpen, wallet } =
    useWallet();
  const [selectedChains, setSelectedChains] = useState<SupportedChain[]>([]);
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>();
  const [ledgerIndex, setLedgerIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customDerivationPath, setCustomDerivationPath] = useState<string | undefined>();
  const [customFlow, setCustomFlow] = useState(false);
  const [saveWallet, setSaveWallet] = useState(getFromStorage('restorePreviousWallet') as boolean);

  const supportedByWallet = useMemo(
    () => availableChainsByWallet[selectedWalletType as WalletType] || SUPPORTED_CHAINS,
    [selectedWalletType],
  );

  const selectedAll = selectedChains?.length === supportedByWallet.length;

  const handleSaveStorageChange = useCallback((value: boolean) => {
    setSaveWallet(value);
    saveInStorage({ key: 'restorePreviousWallet', value });
  }, []);

  const clearState = useCallback(
    (closeModal = true) => {
      if (closeModal) setIsConnectModalOpen(false);
      setTimeout(
        () => {
          setCustomFlow(false);
          setLedgerIndex(0);
          setLoading(false);
          setSelectedChains([]);
          setSelectedWalletType(undefined);
        },
        closeModal ? 400 : 0,
      );
    },
    [setIsConnectModalOpen],
  );

  const handleWalletConnect = useHandleWalletConnect({
    ledgerIndex,
    chains: selectedChains,
    walletType: selectedWalletType,
    customDerivationPath,
  });

  const handleAllClick = useCallback(() => {
    if (selectedWalletType === WalletType.Ledger) return;
    if (selectedWalletType === WalletType.TrustWalletExtension) return;

    setSelectedChains(selectedAll ? [] : supportedByWallet);
  }, [selectedAll, selectedWalletType, supportedByWallet]);

  const selectChain = useCallback(
    (chain: SupportedChain, skipReset: boolean) => () => {
      if (!skipReset) setSelectedWalletType(undefined);

      setSelectedChains((prevSelectedChains) =>
        selectedWalletType &&
        [WalletType.Ledger, WalletType.MetaMask, WalletType.TrustWalletExtension].includes(
          selectedWalletType,
        )
          ? [chain]
          : prevSelectedChains.includes(chain)
          ? prevSelectedChains.filter((c) => c !== chain)
          : [...prevSelectedChains, chain],
      );
    },
    [selectedWalletType],
  );

  const handleConnect = useCallback(
    async (keystore: Keystore, phrase: string) => {
      await unlockWallet(keystore, phrase, selectedChains);
      clearState();
    },
    [unlockWallet, selectedChains, clearState],
  );

  const connectWallet = useCallback(async () => {
    const keystoreOrPhrase = [
      WalletType.Keystore,
      WalletType.Phrase,
      WalletType.CreateKeystore,
    ].includes(selectedWalletType as WalletType);

    if (keystoreOrPhrase) {
      setIsConnectModalOpen(true);
      return setCustomFlow(true);
    }

    setLoading(true);

    try {
      clearState();
      await handleWalletConnect();
    } catch (error) {
      console.error(error);
      showErrorToast(`${t('txManager.failed')} ${selectedWalletType}`);
    }
  }, [clearState, handleWalletConnect, selectedWalletType, setIsConnectModalOpen]);

  const handleWalletTypeSelect = useHandleWalletTypeSelect({
    setSelectedWalletType,
    setSelectedChains,
  });

  const walletOptions = useWalletOptions({ isMdActive });

  const connectedWallets = useMemo(
    () =>
      uniq(
        SUPPORTED_CHAINS.reduce((acc, chain) => {
          const { walletType } = wallet?.[chain] || {};
          if (walletType) acc.push(walletType.toLowerCase());
          return acc;
        }, [] as string[]),
      ),
    [wallet],
  );

  useEffect(() => {
    const previousWallet = getFromStorage('previousWallet');
    const restorePreviousWallet = getFromStorage('restorePreviousWallet');
    if (previousWallet && restorePreviousWallet) {
      setTimeout(() => {
        handleWalletConnect(previousWallet as HandleWalletConnectParams);
      }, 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const oneTimeWalletType = [
    WalletType.CreateKeystore,
    WalletType.Keystore,
    WalletType.Phrase,
    WalletType.Ledger,
    WalletType.TrustWallet,
  ].includes(selectedWalletType || WalletType.Keystore);

  const isWalletTypeDisabled = useCallback(
    (walletType: WalletType) =>
      selectedChains.length > 0
        ? !selectedChains.every((chain) => availableChainsByWallet[walletType].includes(chain))
        : false,
    [selectedChains],
  );

  return (
    <Modal
      HeaderComponent={
        <Box className="!h-20">
          {selectedWalletType === WalletType.Ledger && (
            <InfoTip
              className="m-auto !pt-2 !pb-1 !px-2"
              content="Make sure your Ledger is unlocked and you have opened the app you would like to connect before proceeding"
              contentClassName="py-0"
              title="Unlock Ledger and open App"
              type="warn"
            />
          )}
        </Box>
      }
      className="md:!max-w-[700px] -mt-24"
      isOpened={isConnectModalOpen}
      onBack={customFlow ? () => setCustomFlow(false) : undefined}
      onClose={clearState}
      title={t('views.walletModal.connectWallets')}
      withBody={false}
    >
      <Box
        col
        className={classNames(
          'bg-light-layout-primary md:!max-w-[700px] dark:bg-dark-bg-secondary rounded-3xl',
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
                onCreate={() => setSelectedWalletType(WalletType.CreateKeystore)}
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
              alignCenter
              col
              className={classNames(
                'bg-light-bg-primary dark:bg-dark-bg-primary',
                'md:px-8 pb-10 dark:drop-shadow-4xl z-10',
                isMdActive ? 'rounded-l-3xl' : 'rounded-t-3xl',
              )}
            >
              <Box alignCenter className="p-4 w-[100%] md:gap-4" col={isMdActive}>
                <Box flex={1}>
                  <Typography variant={isMdActive ? 'h4' : 'subtitle2'}>
                    {t('views.walletModal.selectChains')}
                  </Typography>
                </Box>

                <Button
                  className="!h-5 !px-1.5 justify-end"
                  disabled={[
                    WalletType.Ledger,
                    WalletType.MetaMask,
                    WalletType.TrustWalletExtension,
                  ].includes(selectedWalletType || WalletType.Keystore)}
                  onClick={handleAllClick}
                  size="sm"
                  transform="uppercase"
                  type={selectedAll ? 'default' : 'outline'}
                  variant="primary"
                >
                  <Typography variant="caption-xs">{t('views.walletModal.selectAll')}</Typography>
                </Button>
              </Box>

              <Box className="flex-wrap md:w-36">
                {SUPPORTED_CHAINS.map((chain) => (
                  <ChainItem
                    chain={chain}
                    isChainAvailable={availableChainsByWallet[
                      selectedWalletType as WalletType
                    ]?.includes(chain)}
                    key={chain}
                    onClick={selectChain}
                    selected={selectedChains.includes(chain)}
                    selectedWalletType={selectedWalletType}
                    walletType={wallet?.[chain]?.walletType}
                  />
                ))}
              </Box>
            </Box>

            <Box col>
              <Box alignCenter className="pr-6 md:pr-10 px-4">
                <Box flex={1}>
                  <Typography className="py-4" variant={isMdActive ? 'h4' : 'subtitle2'}>
                    {t('views.walletModal.selectWallet')}
                  </Typography>
                </Box>

                <Box alignCenter className="gap-x-2">
                  {!oneTimeWalletType && (
                    <HoverIcon
                      color={saveWallet ? 'cyan' : 'secondary'}
                      iconName={saveWallet ? 'saveFill' : 'save'}
                      onClick={() => handleSaveStorageChange(!saveWallet)}
                      size={20}
                      tooltip={t('views.walletModal.keepWalletConnected')}
                    />
                  )}

                  <Button
                    className="!h-5 !px-1.5 justify-end"
                    onClick={() => clearState(false)}
                    transform="uppercase"
                    type="outline"
                    variant="primary"
                  >
                    <Typography variant="caption">{t('common.reset')}</Typography>
                  </Button>
                </Box>
              </Box>

              <Box className="pl-6 pr-4 flex-wrap">
                {walletOptions.map(
                  ({ visible = true, title, items }) =>
                    visible && (
                      <Box col className="py-1" key={title}>
                        <Typography fontWeight="semibold">{title}</Typography>

                        <Box className="flex-wrap">
                          {items.map(({ tooltip, type, disabled, icon, label }) => (
                            <Tooltip content={tooltip} key={type}>
                              <WalletOption
                                connected={connectedWallets.includes(type.toLowerCase())}
                                disabled={disabled || isWalletTypeDisabled(type)}
                                handleTypeSelect={handleWalletTypeSelect}
                                icon={icon}
                                label={label}
                                selected={type === selectedWalletType}
                                type={type}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    ),
                )}
              </Box>

              {selectedWalletType === WalletType.Ledger && (
                <Box center>
                  <Box alignCenter className="pt-2 mx-6 gap-x-2" flex={1} justify="between">
                    <Typography>{t('common.index')}:</Typography>
                    <Input
                      stretch
                      border="rounded"
                      onChange={(e) => setLedgerIndex(parseInt(e.target.value))}
                      type="number"
                      value={ledgerIndex}
                    />
                  </Box>

                  <DerivationPathDropdown
                    chain={selectedChains[0]}
                    ledgerIndex={ledgerIndex}
                    setCustomDerivationPath={setCustomDerivationPath}
                  />
                </Box>
              )}

              {!customFlow && (
                <Box col className="pb pt-4 md:pt-0 mb-8" flex={1} justify="end">
                  <Button
                    isFancy
                    className="w-2/3 self-center"
                    disabled={!selectedWalletType || !selectedChains.length}
                    loading={loading}
                    onClick={connectWallet}
                    size="md"
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
  );
};

export default memo(ConnectWalletModal);
