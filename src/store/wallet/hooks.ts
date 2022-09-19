import { Chain, Keystore, SupportedChain } from '@thorswap-lib/types';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { chainName } from 'helpers/chainName';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
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

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string, chains: SupportedChain[]) => {
      multichain().connectKeystore(phrase, chains);

      dispatch(actions.connectKeystore(keystore));
      chains.forEach((chain: SupportedChain) => {
        dispatch(walletActions.getWalletByChain(chain));
      });
    },
    [dispatch],
  );

  const disconnectWallet = useCallback(() => {
    multichain().resetClients();

    batch(() => {
      dispatch(actions.disconnect());
      dispatch(midgardActions.resetChainMemberDetails());
    });
  }, [dispatch]);

  const disconnectWalletByChain = useCallback(
    (chain: SupportedChain) => {
      multichain().resetChain(chain);

      batch(() => {
        dispatch(actions.disconnectByChain(chain));
        dispatch(midgardActions.resetChainMemberDetail(chain));
      });
    },
    [dispatch],
  );

  const connectLedger = useCallback(
    async (chain: Chain, addressIndex: number) => {
      const options = { chain: chainName(chain), index: addressIndex };

      try {
        showInfoToast(t('notification.connectingLedger', options));
        await multichain().connectLedger({ chain, addressIndex });

        dispatch(walletActions.getWalletByChain(chain as SupportedChain));
        showInfoToast(t('notification.connectedLedger', options));
      } catch (error) {
        showErrorToast(t('notification.ledgerFailed', options));
      }
    },
    [dispatch],
  );

  const connectXdefiWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain().connectXDefiWallet(chains);

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain));
      });
    },
    [dispatch],
  );

  const connectMetamask = useCallback(
    async (chain: SupportedChain) => {
      await multichain().connectMetamask(chain);

      dispatch(walletActions.getWalletByChain(chain));
    },
    [dispatch],
  );

  const connectPhantom = useCallback(async () => {
    await multichain().connectPhantom();

    dispatch(walletActions.getWalletByChain(Chain.Solana));
  }, [dispatch]);

  const connectKeplr = useCallback(async () => {
    await multichain().connectKeplr();

    dispatch(walletActions.getWalletByChain(Chain.Cosmos));
  }, [dispatch]);

  const connectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain().connectTrustWallet(chains, {
        listeners: { disconnect: disconnectWallet },
      });

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain));
      });
    },
    [dispatch, disconnectWallet],
  );

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible));
    },
    [dispatch],
  );

  const refreshWalletByChain = useCallback(
    (chain: SupportedChain) => {
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
    connectMetamask,
    connectPhantom,
    connectKeplr,
    connectTrustWallet,
    connectLedger,
    refreshWalletByChain,
  };
};
