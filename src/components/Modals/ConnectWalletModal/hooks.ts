import { Chain, EVMWalletOptions, WalletOption } from '@thorswap-lib/types';
import { IconName } from 'components/Atomic';
import { showErrorToast } from 'components/Toast';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

import {
  availableChainsByWallet,
  WalletNameByWalletOption,
  WalletOptionByWalletType,
  WalletType,
} from './types';

type WalletItem = {
  type: WalletType;
  icon: IconName;
  label: string;
  visible?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

export type WalletSection = {
  title: string;
  visible?: boolean;
  items: WalletItem[];
};

type UseWalletOptionsParams = {
  isMdActive: boolean;
};

export const useWalletOptions = ({ isMdActive }: UseWalletOptionsParams) => {
  const [walletOptions, setWalletOptions] = useState<WalletSection[]>([]);

  useEffect(() => {
    import('@thorswap-lib/toolbox-evm').then(({ getETHDefaultWallet, isDetected }) => {
      setWalletOptions([
        {
          title: t('views.walletModal.softwareWallets'),
          items: [
            {
              type: WalletType.TrustWallet,
              icon: 'trustWallet',
              label: t('views.walletModal.trustWallet'),
            },
            {
              visible: isMdActive,
              type: WalletType.TrustWalletExtension,
              icon: 'trustWalletWhite',
              label: t('views.walletModal.trustWalletExtension'),
            },
            {
              type: WalletType.MetaMask,
              icon: 'metamask',
              disabled:
                getETHDefaultWallet() !== WalletOption.METAMASK || isDetected(WalletOption.BRAVE),
              label: t('views.walletModal.metaMask'),
              tooltip: isDetected(WalletOption.BRAVE)
                ? t('views.walletModal.disableBraveWallet')
                : getETHDefaultWallet() !== WalletOption.METAMASK
                ? t('views.walletModal.disableDefaultWallet', {
                    wallet: WalletNameByWalletOption[getETHDefaultWallet()],
                  })
                : '',
            },
            {
              disabled: !isDetected(WalletOption.COINBASE_WEB),
              icon: 'coinbaseWallet' as IconName,
              type: WalletType.CoinbaseExtension,
              visible: isMdActive,
              label: t('views.walletModal.coinbaseWalletWeb'),
            },
            {
              icon: 'xdefi',
              type: WalletType.Xdefi,
              visible: isMdActive,
              label: t('views.walletModal.xdefi'),
            },
            {
              disabled: !isDetected(WalletOption.BRAVE),
              icon: 'brave' as IconName,
              type: WalletType.Brave,
              visible: isMdActive,
              label: t('views.walletModal.braveWallet'),
              tooltip: !isDetected(WalletOption.BRAVE)
                ? t('views.walletModal.enableBraveWallet')
                : '',
            },
            {
              icon: 'keplr',
              label: t('views.walletModal.keplr'),
              type: WalletType.Keplr,
              visible: isMdActive,
            },
          ],
        },
        {
          title: t('views.walletModal.hardwareWallets'),
          visible: isMdActive,
          items: [
            { type: WalletType.Ledger, icon: 'ledger', label: t('views.walletModal.ledger') },
          ],
        },
        {
          title: 'Keystore',
          items: [
            { type: WalletType.Keystore, icon: 'keystore', label: t('views.walletModal.keystore') },
            {
              type: WalletType.CreateKeystore,
              icon: 'plusCircle',
              label: t('views.walletModal.createKeystore'),
            },
            { type: WalletType.Phrase, icon: 'import', label: t('views.walletModal.importPhrase') },
          ],
        },
      ]);
    });
  }, [isMdActive]);

  return walletOptions;
};

export type HandleWalletConnectParams = {
  walletType?: WalletType;
  ledgerIndex: number;
  chains?: Chain[];
  derivationPathType?: 'nativeSegwitMiddleAccount' | 'segwit' | 'legacy' | 'ledgerLive';
};

export const useHandleWalletConnect = ({
  walletType,
  ledgerIndex,
  chains,
  derivationPathType,
}: HandleWalletConnectParams) => {
  const {
    connectKeplr,
    connectLedger,
    connectTrustWallet,
    connectEVMWalletExtension,
    connectXdefiWallet,
  } = useWallet();

  const handleConnectWallet = useCallback(
    (params?: HandleWalletConnectParams) => {
      const selectedChains = params?.chains || chains;
      const selectedWalletType = params?.walletType || walletType;
      const type = params?.derivationPathType || derivationPathType;
      if (!selectedChains || !selectedWalletType) return;

      if (getFromStorage('restorePreviousWallet')) {
        saveInStorage({
          key: 'previousWallet',
          value: { walletType: selectedWalletType, chains: selectedChains, ledgerIndex },
        });
      }

      try {
        switch (selectedWalletType) {
          case WalletType.TrustWallet:
            return connectTrustWallet(selectedChains);
          case WalletType.Xdefi:
            return connectXdefiWallet(selectedChains);
          case WalletType.Ledger:
            return connectLedger(selectedChains[0], ledgerIndex, type);
          case WalletType.Brave:
          case WalletType.MetaMask:
          case WalletType.TrustWalletExtension:
          case WalletType.CoinbaseExtension:
            return connectEVMWalletExtension(
              selectedChains,
              WalletOptionByWalletType[selectedWalletType] as EVMWalletOptions,
            );
          case WalletType.Keplr:
            return connectKeplr();

          default:
            console.error(selectedWalletType);
            return null;
        }
      } catch (error) {
        console.error(error);
        showErrorToast(`${t('txManager.failed')} ${selectedWalletType}`);
      }
    },
    [
      chains,
      connectEVMWalletExtension,
      connectKeplr,
      connectLedger,
      connectTrustWallet,
      connectXdefiWallet,
      derivationPathType,
      ledgerIndex,
      walletType,
    ],
  );

  const addReconnectionOnAccountsChanged = useCallback(async () => {
    const { addAccountsChangedCallback } = await import('@thorswap-lib/toolbox-evm');
    addAccountsChangedCallback(() => {
      handleConnectWallet();
    });
  }, [handleConnectWallet]);

  return { handleConnectWallet, addReconnectionOnAccountsChanged };
};

type HandleWalletTypeSelectParams = {
  setSelectedWalletType: React.Dispatch<React.SetStateAction<WalletType | undefined>>;
  setSelectedChains: React.Dispatch<React.SetStateAction<Chain[]>>;
  selectedChains: Chain[];
};

export const useHandleWalletTypeSelect = ({
  setSelectedWalletType,
  setSelectedChains,
  selectedChains,
}: HandleWalletTypeSelectParams) => {
  const handleXdefi = useCallback(async () => {
    const { evmWallet } = await import('@thorswap-lib/web-extensions');
    if (evmWallet.isDetected(WalletOption.XDEFI)) return true;
    window.open('https://xdefi.io');
  }, []);

  const handleMetamask = useCallback(async () => {
    const { evmWallet } = await import('@thorswap-lib/web-extensions');
    if (evmWallet.isDetected(WalletOption.METAMASK)) return true;
    window.open('https://metamask.io');
  }, []);

  const handleKeplr = useCallback(async () => {
    const { keplrWallet } = await import('@thorswap-lib/web-extensions');
    if (keplrWallet.isDetected()) return true;
    window.open('https://keplr.app');
  }, []);

  const handleTrustWalletExtension = useCallback(async () => {
    const { evmWallet } = await import('@thorswap-lib/web-extensions');
    if (evmWallet.isDetected(WalletOption.TRUSTWALLET_WEB)) return true;
    window.open('https://trustwallet.com/browser-extension/');
  }, []);

  const handleCoinbaseExtension = useCallback(async () => {
    const { evmWallet } = await import('@thorswap-lib/web-extensions');
    if (evmWallet.isDetected(WalletOption.COINBASE_WEB)) return true;
    window.open('https://www.coinbase.com/wallet/articles/getting-started-extension');
  }, []);

  const getChainsToSelect = useCallback(
    (chains: Chain[], walletType: WalletType, nextWalletType?: WalletType) => {
      if (!nextWalletType) {
        const allAvailableChainsSelected = chains.every((chain) =>
          availableChainsByWallet[walletType].includes(chain),
        );

        return allAvailableChainsSelected ? [] : chains;
      }

      switch (walletType) {
        case WalletType.Ledger:
        case WalletType.TrustWalletExtension:
        case WalletType.CoinbaseExtension:
        case WalletType.MetaMask: {
          return [selectedChains[0] || Chain.Ethereum];
        }

        default:
          return chains.length ? chains : availableChainsByWallet[walletType];
      }
    },
    [selectedChains],
  );

  const handleSuccessWalletConnection = useCallback(
    (walletType: WalletType) => {
      setSelectedWalletType((type) => {
        const nextWalletType = type === walletType ? undefined : walletType;

        setSelectedChains(
          (chains) => getChainsToSelect(chains, walletType, nextWalletType) as Chain[],
        );

        return nextWalletType;
      });
    },
    [getChainsToSelect, setSelectedChains, setSelectedWalletType],
  );

  const connectSelectedWallet = useCallback(
    (selectedWallet: WalletType) => {
      switch (selectedWallet) {
        case WalletType.Xdefi:
          return handleXdefi();
        case WalletType.MetaMask:
          return handleMetamask();
        case WalletType.Keplr:
          return handleKeplr();
        case WalletType.TrustWalletExtension:
          return handleTrustWalletExtension();
        case WalletType.CoinbaseExtension:
          return handleCoinbaseExtension();

        default:
          return true;
      }
    },
    [handleXdefi, handleMetamask, handleKeplr, handleTrustWalletExtension, handleCoinbaseExtension],
  );

  const handleWalletTypeSelect = useCallback(
    (selectedWallet: WalletType) => {
      const success = connectSelectedWallet(selectedWallet);

      if (success) {
        handleSuccessWalletConnection(selectedWallet);
      }
    },
    [connectSelectedWallet, handleSuccessWalletConnection],
  );

  return handleWalletTypeSelect;
};
