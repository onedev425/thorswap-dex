import type { DerivationPathArray, EVMWalletOptions } from '@swapkit/core';
import { Chain, WalletOption } from '@swapkit/core';
import { getETHDefaultWallet, isDetected } from '@swapkit/toolbox-evm';
import type { IconName } from 'components/Atomic';
import { showErrorToast } from 'components/Toast';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { captureEvent } from 'services/postHog';
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
    setWalletOptions([
      {
        title: t('views.walletModal.softwareWallets'),
        items: [
          {
            type: WalletType.Walletconnect,
            icon: 'walletConnect',
            label: t('views.walletModal.walletConnect'),
          },
          {
            type: WalletType.TrustWallet,
            icon: 'trustWallet',
            label: t('views.walletModal.trustWallet'),
          },
          {
            type: WalletType.Rainbow,
            icon: 'rainbow',
            label: t('views.walletModal.rainbow'),
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
            tooltip: isDetected(WalletOption.BRAVE)
              ? t('views.walletModal.disableDefaultWallet', {
                  wallet: WalletNameByWalletOption[getETHDefaultWallet()],
                })
              : '',
          },
          {
            icon: 'xdefi',
            type: WalletType.Xdefi,
            visible: isMdActive,
            label: t('views.walletModal.xdefi'),
          },
          {
            disabled:
              !isDetected(WalletOption.BRAVE) || getETHDefaultWallet() !== WalletOption.BRAVE,
            icon: 'brave' as IconName,
            type: WalletType.Brave,
            visible: isMdActive,
            label: t('views.walletModal.braveWallet'),
            // @ts-expect-error
            tooltip: !navigator?.brave?.isBrave?.()
              ? t('views.walletModal.installBraveBrowser')
              : getETHDefaultWallet() !== WalletOption.BRAVE
              ? t('views.walletModal.enableBraveWallet')
              : '',
          },
          {
            disabled: !window.okxwallet,
            icon: 'okx' as IconName,
            type: WalletType.Okx,
            visible: isMdActive,
            label: t('views.walletModal.okxWallet'),
            tooltip: window.okxwallet ? '' : t('views.walletModal.installOkxWallet'),
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
          { type: WalletType.Trezor, icon: 'trezor', label: t('views.walletModal.trezor') },
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
  }, [isMdActive]);

  return walletOptions;
};

export type HandleWalletConnectParams = {
  walletType?: WalletType;
  derivationPath?: DerivationPathArray;
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
    connectTrezor,
    connectWalletconnect,
    connectEVMWalletExtension,
    connectXdefiWallet,
    connectOkx,
  } = useWallet();

  const handleConnectWallet = useCallback(
    async (params?: HandleWalletConnectParams) => {
      const { getDerivationPathFor } = await import('@swapkit/wallet-ledger');

      const selectedChains = params?.chains || chains;
      const selectedWalletType = params?.walletType || walletType;
      const type = params?.derivationPathType || derivationPathType;
      const derivationPath =
        params?.derivationPath ||
        (getDerivationPathFor({
          chain: selectedChains?.[0] || Chain.THORChain,
          type,
          index: ledgerIndex,
        }) as DerivationPathArray);
      if (!selectedChains || !selectedWalletType) return;

      if (getFromStorage('restorePreviousWallet')) {
        saveInStorage({
          key: 'previousWallet',
          value: { walletType: selectedWalletType, chains: selectedChains, ledgerIndex },
        });
      }

      captureEvent('connect_wallet', {
        type: selectedWalletType,
        chains: selectedChains,
        info: { derivationPath, ledgerIndex },
      });

      try {
        switch (selectedWalletType) {
          case WalletType.Xdefi:
            return connectXdefiWallet(selectedChains);
          case WalletType.Ledger:
            return connectLedger(selectedChains[0], derivationPath, ledgerIndex);
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
          case WalletType.Trezor:
            return connectTrezor(selectedChains[0], derivationPath, ledgerIndex);
          case WalletType.Rainbow:
          case WalletType.TrustWallet:
          case WalletType.Walletconnect:
            return connectWalletconnect(selectedChains);
          case WalletType.Okx:
            return connectOkx(selectedChains);
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
      connectOkx,
      connectTrezor,
      connectWalletconnect,
      connectXdefiWallet,
      derivationPathType,
      ledgerIndex,
      walletType,
    ],
  );

  const addReconnectionOnAccountsChanged = useCallback(async () => {
    const { addAccountsChangedCallback } = await import('@swapkit/toolbox-evm');
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

const WalletTypeToOption: Record<WalletType, WalletOption> = {
  [WalletType.Brave]: WalletOption.BRAVE,
  [WalletType.CoinbaseExtension]: WalletOption.COINBASE_WEB,
  [WalletType.CreateKeystore]: WalletOption.KEYSTORE,
  [WalletType.Keplr]: WalletOption.KEPLR,
  [WalletType.Keystore]: WalletOption.KEYSTORE,
  [WalletType.Ledger]: WalletOption.LEDGER,
  [WalletType.MetaMask]: WalletOption.METAMASK,
  [WalletType.Okx]: WalletOption.OKX,
  [WalletType.Phrase]: WalletOption.KEYSTORE,
  [WalletType.Rainbow]: WalletOption.WALLETCONNECT,
  [WalletType.Trezor]: WalletOption.TREZOR,
  [WalletType.TrustWallet]: WalletOption.WALLETCONNECT,
  [WalletType.TrustWalletExtension]: WalletOption.TRUSTWALLET_WEB,
  [WalletType.Walletconnect]: WalletOption.WALLETCONNECT,
  [WalletType.Xdefi]: WalletOption.XDEFI,
};

export const useHandleWalletTypeSelect = ({
  setSelectedWalletType,
  setSelectedChains,
  selectedChains,
}: HandleWalletTypeSelectParams) => {
  const handleEVMWallet = useCallback(async (walletType: WalletType) => {
    const { isDetected } = await import('@swapkit/toolbox-evm');
    if (isDetected(WalletTypeToOption[walletType])) return true;

    switch (walletType) {
      case WalletType.MetaMask:
        return window.open('https://metamask.io');
      case WalletType.TrustWalletExtension:
        return window.open('https://trustwallet.com/browser-extension/');
      case WalletType.CoinbaseExtension:
        return window.open('https://www.coinbase.com/wallet/articles/getting-started-extension');
      case WalletType.Xdefi:
        return window.open('https://xdefi.io');
      case WalletType.Brave:
        return window.open('brave://wallet/');
    }
  }, []);

  const handleWindowWallet = useCallback(async (windowPath: 'keplr' | 'okxwallet') => {
    if (window[windowPath]) return true;

    switch (windowPath) {
      case 'okxwallet':
        return window.open('https://www.okx.com/web3');
      case 'keplr':
        return window.open('https://keplr.app');
    }
  }, []);

  const connectSelectedWallet = useCallback(
    (selectedWallet: WalletType) => {
      switch (selectedWallet) {
        case WalletType.Xdefi:
          return handleEVMWallet(selectedWallet);
        case WalletType.Keplr:
          return handleWindowWallet('keplr');
        case WalletType.Okx:
          return handleWindowWallet('okxwallet');

        default:
          return true;
      }
    },
    [handleEVMWallet, handleWindowWallet],
  );

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
        case WalletType.Trezor:
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

  const handleWalletTypeSelect = useCallback(
    async (selectedWallet: WalletType) => {
      const success = await connectSelectedWallet(selectedWallet);

      if (success) {
        handleSuccessWalletConnection(selectedWallet);
      }
    },
    [connectSelectedWallet, handleSuccessWalletConnection],
  );

  return handleWalletTypeSelect;
};
