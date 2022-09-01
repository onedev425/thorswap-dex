import {
  KeplrWalletStatus,
  MetaMaskWalletStatus,
  PhantomWalletStatus,
  XdefiWalletStatus,
} from '@thorswap-lib/multichain-web-extensions';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import { IconName } from 'components/Atomic';
import { showErrorToast } from 'components/Toast';
import deepEqual from 'fast-deep-equal';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { keplr } from 'services/keplr';
import { metamask } from 'services/metamask';
import { phantom } from 'services/phantom';
import { xdefi } from 'services/xdefi';
import { useWallet } from 'store/wallet/hooks';

import { availableChainsByWallet, WalletType } from './types';

type WalletItem = {
  type: WalletType;
  icon: IconName;
  label: string;
  visible?: boolean;
  disabled?: boolean;
};

type UseWalletOptionsParams = {
  isMdActive: boolean;
};

export const useWalletOptions = ({ isMdActive }: UseWalletOptionsParams): WalletItem[] => {
  const xDefiNotPrioritized = useMemo(
    () => xdefi.isWalletDetected() === XdefiWalletStatus.XdefiNotPrioritized,
    [],
  );
  const metamaskNotPrioritized = useMemo(
    () => metamask.isWalletDetected() === MetaMaskWalletStatus.XdefiDetected,
    [],
  );

  return useMemo(
    () => [
      {
        icon: 'xdefi',
        type: WalletType.Xdefi,
        visible: isMdActive,
        disabled: xDefiNotPrioritized,
        label: xDefiNotPrioritized
          ? t('views.walletModal.prioritiseXdefi')
          : t('views.walletModal.xdefi'),
      },
      {
        icon: 'phantom',
        label: t('views.walletModal.phantom'),
        type: WalletType.Phantom,
        visible: isMdActive,
      },
      {
        icon: 'keplr' as const,
        label: t('views.walletModal.keplr'),
        type: WalletType.Keplr,
        visible: isMdActive,
      },
      {
        type: WalletType.TrustWallet,
        icon: 'trustWallet',
        label: t('views.walletModal.trustWallet'),
      },
      {
        type: WalletType.MetaMask,
        icon: 'metamask',
        disabled: metamaskNotPrioritized,
        label: metamaskNotPrioritized
          ? t('views.walletModal.metamaskDisableXdefi')
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
    [xDefiNotPrioritized, isMdActive, metamaskNotPrioritized],
  );
};

export type HandleWalletConnectParams = {
  walletType?: WalletType;
  ledgerIndex: number;
  chains?: SupportedChain[];
};

export const useHandleWalletConnect = ({
  walletType,
  ledgerIndex,
  chains,
}: HandleWalletConnectParams) => {
  const {
    connectXdefiWallet,
    connectMetamask,
    connectPhantom,
    connectKeplr,
    connectLedger,
    connectTrustWallet,
  } = useWallet();

  const handleConnectWallet = useCallback(
    async (params?: HandleWalletConnectParams) => {
      const selectedChains = params?.chains || chains;
      const selectedWalletType = params?.walletType || walletType;
      if (!selectedChains || !selectedWalletType) return;

      if (getFromStorage('restorePreviousWallet')) {
        saveInStorage({
          key: 'previousWallet',
          value: {
            walletType: selectedWalletType,
            chains: selectedChains,
            ledgerIndex,
          },
        });
      }

      try {
        switch (selectedWalletType) {
          case WalletType.TrustWallet:
            return await connectTrustWallet(selectedChains);
          case WalletType.Xdefi:
            return await connectXdefiWallet(selectedChains);
          case WalletType.Ledger:
            return await connectLedger(selectedChains[0], ledgerIndex);
          case WalletType.MetaMask:
            return await connectMetamask(selectedChains[0]);
          case WalletType.Phantom:
            return await connectPhantom();
          case WalletType.Keplr:
            return await connectKeplr();

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
      walletType,
      connectTrustWallet,
      chains,
      connectXdefiWallet,
      connectLedger,
      ledgerIndex,
      connectMetamask,
      connectPhantom,
      connectKeplr,
    ],
  );

  return handleConnectWallet;
};

type HandleWalletTypeSelectParams = {
  setSelectedWalletType: React.Dispatch<React.SetStateAction<WalletType | undefined>>;
  setSelectedChains: React.Dispatch<React.SetStateAction<SupportedChain[]>>;
};

export const useHandleWalletTypeSelect = ({
  setSelectedWalletType,
  setSelectedChains,
}: HandleWalletTypeSelectParams) => {
  const handleXdefi = useCallback(() => {
    const xdefiStatus = xdefi.isWalletDetected();

    if (xdefiStatus === XdefiWalletStatus.XdefiNotInstalled) {
      window.open('https://xdefi.io');
    }

    if (xdefiStatus === XdefiWalletStatus.XdefiNotPrioritized) {
      showErrorToast(t('notification.prioritisationError'), t('notification.xdefiPrioritise'));
    }

    return xdefiStatus === XdefiWalletStatus.XdefiPrioritized;
  }, []);

  const handleMetamask = useCallback(() => {
    const xdefiStatus = xdefi.isWalletDetected();
    const metamaskStatus = metamask.isWalletDetected();

    if (metamaskStatus === MetaMaskWalletStatus.NoWeb3Provider) {
      window.open('https://metamask.io');
    }

    if (metamaskStatus === MetaMaskWalletStatus.XdefiDetected) {
      showErrorToast(t('notification.prioritisationError'), t('notification.xdefiDeprioritise'));
    }

    return (
      metamaskStatus === MetaMaskWalletStatus.MetaMaskDetected &&
      xdefiStatus !== XdefiWalletStatus.XdefiPrioritized
    );
  }, []);

  const handlePhantom = useCallback(() => {
    const phantomStatus = phantom.isWalletDetected();

    if (phantomStatus === PhantomWalletStatus.PhantomDetected) {
      return true;
    } else {
      window.open('https://phantom.app');
      return false;
    }
  }, []);

  const handleKeplr = useCallback(() => {
    const keplrStatus = keplr.isWalletDetected();

    if (keplrStatus === KeplrWalletStatus.KeplrDetected) {
      return true;
    } else {
      window.open('https://keplr.app');
      return false;
    }
  }, []);

  const getChainsToSelect = useCallback(
    (chains: SupportedChain[], walletType: WalletType, nextWalletType?: WalletType) => {
      if (!nextWalletType) {
        return deepEqual(chains, availableChainsByWallet[walletType]) ? [] : chains;
      }

      switch (walletType) {
        case WalletType.Ledger:
        case WalletType.MetaMask: {
          const defaultChain =
            walletType === WalletType.MetaMask ? Chain.Ethereum : Chain.THORChain;

          return [chains[0] || defaultChain];
        }

        default:
          return chains.length ? chains : availableChainsByWallet[walletType];
      }
    },
    [],
  );

  const handleSuccessWalletConnection = useCallback(
    (walletType: WalletType) => {
      setSelectedWalletType((type) => {
        const nextWalletType = type === walletType ? undefined : walletType;

        setSelectedChains(
          (chains) => getChainsToSelect(chains, walletType, nextWalletType) as SupportedChain[],
        );

        return nextWalletType;
      });
    },
    [getChainsToSelect, setSelectedChains, setSelectedWalletType],
  );

  const connectSelectedWallet = useCallback(
    (selectedWallet: WalletType): boolean => {
      switch (selectedWallet) {
        case WalletType.Xdefi:
          return handleXdefi();
        case WalletType.MetaMask:
          return handleMetamask();
        case WalletType.Phantom:
          return handlePhantom();
        case WalletType.Keplr:
          return handleKeplr();

        default:
          return true;
      }
    },
    [handleMetamask, handlePhantom, handleXdefi, handleKeplr],
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
