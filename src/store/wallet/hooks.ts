import type { DerivationPathArray, EVMWalletOptions, Keystore } from '@thorswap-lib/types';
import { Chain, WalletOption } from '@thorswap-lib/types';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { chainName } from 'helpers/chainName';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { t } from 'services/i18n';
import { ledgerLive } from 'services/ledgerLive';
import { captureEvent } from 'services/postHog';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useAppDispatch, useAppSelector } from 'store/store';

import type { LedgerLiveChain } from '../../../ledgerLive/wallet/LedgerLive';
import { connectLedgerLive, mapLedgerChainToChain } from '../../../ledgerLive/wallet/LedgerLive';

import * as walletActions from './actions';
import { actions } from './slice';

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(({ wallet }) => wallet);

  const isWalletLoading =
    wallet.walletLoading || Object.values(wallet.chainWalletLoading).some((loading) => loading);

  const setWallets = useCallback(
    (chains: Chain[]) =>
      chains.forEach((chain) => {
        !IS_LEDGER_LIVE
          ? dispatch(walletActions.getWalletByChain(chain))
          : dispatch(walletActions.updateLedgerLiveBalance(chain));
      }),
    [dispatch],
  );

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string, chains: Chain[]) => {
      const { connectKeystore } = await (await import('services/swapKit')).getSwapKitClient();
      const { ThorchainToolbox } = await import('@thorswap-lib/toolbox-cosmos');
      const thorchainToolbox = ThorchainToolbox({});
      const pubKey = await thorchainToolbox.getPubKeyFromMnemonic(phrase);

      captureEvent('connect_wallet', { type: WalletOption.KEYSTORE, chains });

      await connectKeystore(chains, phrase);
      dispatch(
        actions.connectKeystore({
          keystore,
          phrase,
          pubKey,
        }),
      );
      setWallets(chains);
    },
    [dispatch, setWallets],
  );

  const disconnectWallet = useCallback(() => {
    batch(() => {
      dispatch(actions.disconnect());
    });
  }, [dispatch]);

  const disconnectWalletByChain = useCallback(
    (chain: Chain) => {
      batch(() => {
        dispatch(actions.disconnectByChain(chain));
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

  const connectLedgerLiveWallet = useCallback(
    async (chains?: Chain[]) => {
      const account = await ledgerLive().requestAccount(chains);
      const chain = mapLedgerChainToChain(account.currency as LedgerLiveChain);
      const wallet = await connectLedgerLive(chain, account);
      dispatch(
        walletActions.setLedgerLiveWalletByChain({
          ...wallet,
        }),
      );
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

  const connectOkx = useCallback(
    async (chains: Chain[]) => {
      const { connectOkx } = await (await import('services/swapKit')).getSwapKitClient();

      await connectOkx(chains);

      setWallets(chains);
    },
    [setWallets],
  );

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible));
    },
    [dispatch],
  );

  const refreshWalletByChain = useCallback(
    (chain: Chain) => {
      !IS_LEDGER_LIVE
        ? dispatch(walletActions.getWalletByChain(chain))
        : dispatch(walletActions.updateLedgerLiveBalance(chain));
    },
    [dispatch],
  );

  return {
    ...wallet,
    ...walletActions,
    connectBraveWallet,
    connectCoinbaseWalletExtension,
    connectEVMWalletExtension,
    connectKeplr,
    connectLedger,
    connectLedgerLiveWallet,
    connectMetamask,
    connectOkx,
    connectTrezor,
    connectTrustWalletExtension,
    connectWalletconnect,
    connectXdefiWallet,
    disconnectWallet,
    disconnectWalletByChain,
    isWalletLoading,
    refreshWalletByChain,
    setIsConnectModalOpen,
    unlockWallet,
  };
};
