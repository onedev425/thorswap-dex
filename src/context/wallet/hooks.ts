import type { AssetValue, DerivationPathArray, EVMChain } from '@swapkit/core';
import { Chain, WalletOption } from '@swapkit/core';
import type { Keystore } from '@swapkit/wallet-keystore';
import { isMobile, okxWalletDetected } from 'components/Modals/ConnectWalletModal/hooks';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { useWalletContext, useWalletDispatch, useWalletState } from 'context/wallet/WalletProvider';
import { chainName } from 'helpers/chainName';
import { t } from 'i18next';
import { useCallback, useMemo } from 'react';
import { ledgerLive } from 'services/ledgerLive';
import { logEvent, logException } from 'services/logger';

import type { LedgerLiveChain } from '../../../ledgerLive/wallet/LedgerLive';
import { connectLedgerLive, mapLedgerChainToChain } from '../../../ledgerLive/wallet/LedgerLive';

export const useWallet = () => {
  const { wallet, chainLoading } = useWalletState();

  const getWallet = useCallback((chain: Chain) => wallet[chain as keyof typeof wallet], [wallet]);
  const getWalletAddress = useCallback(
    (chain: Chain) => wallet[chain as keyof typeof wallet]?.address || '',
    [wallet],
  );

  const hasWallet = useMemo(() => Object.values(wallet).some((w) => !!w), [wallet]);

  const walletAddresses = useMemo(
    () =>
      Object.entries(wallet)
        .map(([chain, w]) => (chain === Chain.Ethereum ? w?.address?.toLowerCase() : w?.address))
        .filter((a) => !!a) as string[],
    [wallet],
  );

  const isWalletLoading = useMemo(
    () =>
      Object.keys(wallet).some((key) => {
        return chainLoading[key as keyof typeof wallet];
      }),
    [chainLoading, wallet],
  );

  const walletState = useMemo(() => wallet, [wallet]);

  return {
    wallet: walletState,
    chainLoading,
    walletAddresses,
    isWalletLoading,
    getWalletAddress,
    hasWallet,
    getWallet,
  };
};

export const useKeystore = () => {
  const { wallet, keystore, pubKey, phrase } = useWalletState();

  const signingRequired = useCallback(
    (assets: AssetValue[]) => {
      if (!keystore) return false;
      return assets.some(
        (asset) => wallet[asset.chain as keyof typeof wallet]?.walletType === WalletOption.KEYSTORE,
      );
    },
    [keystore, wallet],
  );

  return useMemo(
    () => ({ signingRequired, keystore, pubKey, phrase }),
    [keystore, pubKey, phrase, signingRequired],
  );
};

export const useWalletConnectModal = () => {
  const [{ isConnectModalOpen }, walletDispatch] = useWalletContext();
  const setIsConnectModalOpen = useCallback(
    (payload: boolean) => walletDispatch({ type: 'setIsConnectModalOpen', payload }),
    [walletDispatch],
  );

  return { isConnectModalOpen, setIsConnectModalOpen };
};

export const useWalletBalance = () => {
  const walletDispatch = useWalletDispatch();

  const getWalletByChain = useCallback(
    async (chain: Chain) => {
      walletDispatch({ type: 'setChainWalletLoading', payload: { chain, loading: true } });
      try {
        const client = await (await import('services/swapKit')).getSwapKitClient();
        const data = client.getWallet(chain)
          ? await client.getWalletWithBalance(chain, true)
          : undefined;

        if (data) {
          walletDispatch({
            type: 'setChainWallet',
            payload: {
              chain,
              data: {
                chain,
                address: data?.address || '',
                balance: data?.balance || [],
                walletType: data?.walletType || WalletOption.KEYSTORE,
              },
            },
          });
        }
      } finally {
        walletDispatch({ type: 'setChainWalletLoading', payload: { chain, loading: false } });
      }
    },
    [walletDispatch],
  );

  const reloadAllWallets = useCallback(
    async (chains: (Chain | undefined)[]) => {
      for (const chain of chains) {
        chain && getWalletByChain(chain);
      }
    },
    [getWalletByChain],
  );

  return { getWalletByChain, reloadAllWallets };
};

export const useLedgerLive = () => {
  const [{ wallet }, walletDispatch] = useWalletContext();
  const updateLedgerLiveBalance = useCallback(
    async (chain: Chain) => {
      const chainWallet = wallet[chain as keyof typeof wallet];
      if (!chainWallet) return;
      const { getBalance } = chainWallet?.walletMethods || {};
      const balance = (await getBalance(chainWallet?.address)) as AssetValue[];

      if (chain !== Chain.Ethereum) await new Promise((res) => setTimeout(res, 200));

      walletDispatch({
        type: 'setChainWallet',
        payload: {
          chain,
          data: {
            ...chainWallet,
            address: chainWallet?.address || '',
            walletType: WalletOption.LEDGER,
            balance,
          },
        },
      });
      return { chain, balance };
    },
    [wallet, walletDispatch],
  );

  return { updateLedgerLiveBalance };
};

export const useConnectWallet = () => {
  const walletDispatch = useWalletDispatch();
  const { getWalletByChain, reloadAllWallets } = useWalletBalance();

  const connectLedger = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      const options = { chain: chainName(chain), index };

      const { connectLedger: swapKitConnectLedger } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      showInfoToast(t('notification.connectingLedger', options));
      // @ts-expect-error
      await swapKitConnectLedger([chain], derivationPath);
      await getWalletByChain(chain);

      showInfoToast(t('notification.connectedLedger', options));
    },
    [getWalletByChain],
  );

  const connectLedgerLiveWallet = useCallback(
    async (chains?: Chain[]) => {
      const account = await ledgerLive().requestAccount(chains);
      const chain = mapLedgerChainToChain(account.currency as LedgerLiveChain);
      const { wallet } = await connectLedgerLive(chain, account);

      walletDispatch({ type: 'setChainWallet', payload: { chain, data: { ...wallet, chain } } });
    },
    [walletDispatch],
  );

  const connectTrezor = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      const options = { chain: chainName(chain), index };
      const { connectTrezor: swapKitConnectTrezor } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      try {
        showInfoToast(t('notification.connectingTrezor', options));
        // @ts-expect-error
        await swapKitConnectTrezor(chain, derivationPath);
        await getWalletByChain(chain as Chain);
        showInfoToast(t('notification.connectedTrezor', options));
      } catch (error: NotWorth) {
        logException(error as Error);
        showErrorToast(
          t('notification.trezorFailed', options),
          undefined,
          undefined,
          error as Error,
        );
      }
    },
    [getWalletByChain],
  );

  const connectXdefiWallet = useCallback(
    async (chains: Chain[]) => {
      const { connectXDEFI: swapKitConnectXDEFI } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      // @ts-expect-error
      await swapKitConnectXDEFI(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectCoinbaseMobile = useCallback(
    async (chains: EVMChain[]) => {
      const skclient = await (await import('services/swapKit')).getSwapKitClient();

      await skclient.connectCoinbaseWallet(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectEVMWalletExtension = useCallback(
    async (chains: EVMChain[], wallet: WalletOption) => {
      if (wallet === WalletOption.OKX_MOBILE && isMobile && !okxWalletDetected) {
        window.open('okx://wallet/dapp/details?dappUrl=https://app.thorswap.finance/swap');
        return;
      }
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      // @ts-expect-error
      await swapKitConnectEVMWallet(chains, wallet);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectBraveWallet = useCallback(
    async (chains: EVMChain[]) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet(chains, WalletOption.BRAVE);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectWalletconnect = useCallback(
    async (chains: Chain[]) => {
      const { connectWalletconnect } = await (await import('services/swapKit')).getSwapKitClient();

      //@ts-expect-error
      await connectWalletconnect(chains, {
        listeners: {
          disconnect: () => walletDispatch({ type: 'disconnect', payload: undefined }),
        },
      });

      reloadAllWallets(chains);
    },
    [reloadAllWallets, walletDispatch],
  );

  const connectOkx = useCallback(
    async (chains: Chain[]) => {
      const { connectOkx } = await (await import('services/swapKit')).getSwapKitClient();
      // @ts-expect-error
      await connectOkx(chains);
      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectTrustWalletExtension = useCallback(
    async (chain: Chain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();
      // @ts-expect-error
      await swapKitConnectEVMWallet([chain], WalletOption.TRUSTWALLET_WEB);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectCoinbaseWalletExtension = useCallback(
    async (chain: EVMChain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.COINBASE_WEB);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectMetamask = useCallback(
    async (chain: EVMChain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.METAMASK);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectKeplr = useCallback(
    async (chains: (Chain.Cosmos | Chain.Kujira)[]) => {
      const { connectKeplr: swapKitConnectKeplr } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectKeplr(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const unlockKeystore = useCallback(
    async (keystore: Keystore, phrase: string, chains: Chain[]) => {
      const { connectKeystore } = await (await import('services/swapKit')).getSwapKitClient();
      const { ThorchainToolbox } = await import('@swapkit/toolbox-cosmos');
      const { getPubKeyFromMnemonic } = ThorchainToolbox({});
      const pubKey = await getPubKeyFromMnemonic(phrase);

      await connectKeystore(chains, phrase);
      walletDispatch({ type: 'connectKeystore', payload: { keystore, phrase, pubKey } });
      logEvent('connect_wallet', { type: WalletOption.KEYSTORE, chains });
      reloadAllWallets(chains);
    },
    [reloadAllWallets, walletDispatch],
  );

  const connectKeepkey = useCallback(
    async (chains: Chain[]) => {
      const { connectKeepkey: swapKitConnectKeepkey } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      showInfoToast(t('notification.connectingKeepkey'));

      // @ts-expect-error
      const keepkeyApiKey = await swapKitConnectKeepkey(chains);
      // @ts-expect-error
      localStorage.setItem('keepkeyApiKey', (keepkeyApiKey as string) || '');
      await reloadAllWallets(chains);

      showInfoToast(t('notification.connectedKeepkey'));
    },
    [reloadAllWallets],
  );

  return {
    unlockKeystore,
    connectLedger,
    connectLedgerLiveWallet,
    connectTrezor,
    connectXdefiWallet,
    connectEVMWalletExtension,
    connectBraveWallet,
    connectTrustWalletExtension,
    connectCoinbaseMobile,
    connectCoinbaseWalletExtension,
    connectMetamask,
    connectKeplr,
    connectWalletconnect,
    connectOkx,
    connectKeepkey,
  };
};
