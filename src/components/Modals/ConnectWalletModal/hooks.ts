import { WalletStatus } from '@thorswap-lib/multichain-web-extensions';
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
  return useMemo(
    () => [
      {
        icon: 'xdefi',
        type: WalletType.Xdefi,
        visible: isMdActive,
        label: t('views.walletModal.xdefi'),
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
        disabled: metamask.isXDefiPrioritized(),
        label: metamask.isXDefiPrioritized()
          ? t('views.walletModal.metaMaskDisableXDefiPrioritized')
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
    [isMdActive],
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
    const detected = WalletStatus.Detected === xdefi.isWalletDetected();

    if (!detected) {
      window.open('https://xdefi.io');
    }

    return detected;
  }, []);

  const handleMetamask = useCallback(() => {
    const detected = WalletStatus.Detected === metamask.isWalletDetected();

    if (!detected) {
      window.open('https://metamask.io');
    }

    return detected;
  }, []);

  const handlePhantom = useCallback(() => {
    const detected = WalletStatus.Detected === phantom.isWalletDetected();

    if (!detected) {
      window.open('https://phantom.app');
    }

    return detected;
  }, []);

  const handleKeplr = useCallback(() => {
    const detected = WalletStatus.Detected === keplr.isWalletDetected();

    if (!detected) {
      window.open('https://keplr.app');
    }

    return detected;
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
