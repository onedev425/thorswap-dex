import {
  Chain,
  DerivationPathArray,
  EVMWalletOptions,
  Keystore,
  WalletOption,
} from '@thorswap-lib/types';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { chainName } from 'helpers/chainName';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { t } from 'services/i18n';
import { actions as midgardActions } from 'store/midgard/slice';
import { useAppDispatch, useAppSelector } from 'store/store';

import * as walletActions from './actions';
import { actions } from './slice';

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const walletState = useAppSelector(({ wallet }) => wallet);

  const isWalletLoading =
    walletState.walletLoading ||
    Object.values(walletState.chainWalletLoading).some((loading) => loading);

  const setWallets = useCallback(
    (chains: Chain[]) => chains.forEach((chain) => dispatch(walletActions.getWalletByChain(chain))),
    [dispatch],
  );

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string, chains: Chain[]) => {
      const { ThorchainToolbox } = await import('@thorswap-lib/toolbox-cosmos');
      const { connectKeystore } = await (await import('services/swapKit')).getSwapKitClient();

      await connectKeystore(chains, phrase);
      const thorchainToolbox = ThorchainToolbox({});
      const thorchainPrivateKey = chains.includes(Chain.THORChain)
        ? thorchainToolbox.createKeyPair(phrase)
        : undefined;
      const thorchainPublicKey = thorchainPrivateKey?.pubKey();
      dispatch(
        actions.connectKeystore({
          keystore,
          phrase,
          privateKey: thorchainPrivateKey,
          publicKey: thorchainPublicKey,
        }),
      );
      setWallets(chains);
    },
    [dispatch, setWallets],
  );

  const disconnectWallet = useCallback(() => {
    batch(() => {
      dispatch(actions.disconnect());
      dispatch(midgardActions.resetChainMemberDetails());
    });
  }, [dispatch]);

  const disconnectWalletByChain = useCallback(
    (chain: Chain) => {
      batch(() => {
        dispatch(actions.disconnectByChain(chain));
        dispatch(midgardActions.resetChainMemberDetail(chain));
      });
    },
    [dispatch],
  );

  const connectLedger = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      const options = { chain: chainName(chain), index };

      const { connectLedger: swapKitConnectLedger } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      try {
        showInfoToast(t('notification.connectingLedger', options));
        await swapKitConnectLedger(chain, derivationPath);

        dispatch(walletActions.getWalletByChain(chain as Chain));
        showInfoToast(t('notification.connectedLedger', options));
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(t('notification.ledgerFailed', options));
      }
    },
    [dispatch],
  );

  const connectTrezor = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      const options = { chain: chainName(chain), index };

      const { connectTrezor: swapKitConnectTrezor } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      try {
        showInfoToast(t('notification.connectingTrezor', options));
        await swapKitConnectTrezor(chain, derivationPath);

        dispatch(walletActions.getWalletByChain(chain as Chain));
        showInfoToast(t('notification.connectedTrezor', options));
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(t('notification.trezorFailed', options));
      }
    },
    [dispatch],
  );

  const connectXdefiWallet = useCallback(
    async (chains: Chain[]) => {
      const { connectXDEFI: swapKitConnectXDEFI } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectXDEFI(chains);

      setWallets(chains);
    },
    [setWallets],
  );

  const connectEVMWalletExtension = useCallback(
    async (chains: Chain[], wallet: EVMWalletOptions) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet(chains, wallet);

      setWallets(chains);
    },
    [setWallets],
  );

  const connectBraveWallet = useCallback(
    async (chains: Chain[]) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet(chains, WalletOption.BRAVE);

      setWallets(chains);
    },
    [setWallets],
  );

  const connectTrustWalletExtension = useCallback(
    async (chain: Chain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.TRUSTWALLET_WEB);

      setWallets([chain]);
    },
    [setWallets],
  );

  const connectCoinbaseWalletExtension = useCallback(
    async (chain: Chain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.COINBASE_WEB);

      setWallets([chain]);
    },
    [setWallets],
  );

  const connectMetamask = useCallback(
    async (chain: Chain) => {
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.METAMASK);

      setWallets([chain]);
    },
    [setWallets],
  );

  const connectKeplr = useCallback(async () => {
    const { connectKeplr: swapKitConnectKeplr } = await (
      await import('services/swapKit')
    ).getSwapKitClient();

    await swapKitConnectKeplr();

    setWallets([Chain.Cosmos]);
  }, [setWallets]);

  const connectTrustWallet = useCallback(
    async (chains: Chain[]) => {
      const { connectTrustwallet } = await (await import('services/swapKit')).getSwapKitClient();

      await connectTrustwallet(chains, {
        listeners: { disconnect: disconnectWallet },
      });

      setWallets(chains);
    },
    [disconnectWallet, setWallets],
  );

  const connectWalletconnect = useCallback(
    async (chains: Chain[]) => {
      const { connectWalletconnect } = await (await import('services/swapKit')).getSwapKitClient();

      await connectWalletconnect(chains, {
        listeners: { disconnect: disconnectWallet },
      });

      setWallets(chains);
    },
    [disconnectWallet, setWallets],
  );

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible));
    },
    [dispatch],
  );

  const refreshWalletByChain = useCallback(
    (chain: Chain) => {
      dispatch(walletActions.getWalletByChain(chain));
    },
    [dispatch],
  );

  return {
    ...walletState,
    ...walletActions,
    isWalletLoading,
    unlockWallet,
    setIsConnectModalOpen,
    disconnectWallet,
    disconnectWalletByChain,
    connectXdefiWallet,
    connectBraveWallet,
    connectTrustWalletExtension,
    connectCoinbaseWalletExtension,
    connectEVMWalletExtension,
    connectMetamask,
    connectKeplr,
    connectTrustWallet,
    connectWalletconnect,
    connectLedger,
    connectTrezor,
    refreshWalletByChain,
  };
};
