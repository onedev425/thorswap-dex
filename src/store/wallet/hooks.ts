import { Chain, Keystore } from '@thorswap-lib/types';
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
    async (keystore: Keystore, phrase: string, chains: Chain[]) => {
      multichain().connectKeystore(phrase, chains);
      dispatch(actions.connectKeystore(keystore));
      chains.forEach((chain: Chain) => {
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
    (chain: Chain) => {
      multichain().resetChain(chain);

      batch(() => {
        dispatch(actions.disconnectByChain(chain));
        dispatch(midgardActions.resetChainMemberDetail(chain));
      });
    },
    [dispatch],
  );

  const connectLedger = useCallback(
    async (chain: Chain, index: number, customDerivationPath?: string) => {
      const options = { chain: chainName(chain), index: index };

      try {
        showInfoToast(t('notification.connectingLedger', options));

        await multichain().connectLedger({ chain, customDerivationPath, addressIndex: index });

        dispatch(walletActions.getWalletByChain(chain as Chain));
        showInfoToast(t('notification.connectedLedger', options));
      } catch (error) {
        showErrorToast(t('notification.ledgerFailed', options));
      }
    },
    [dispatch],
  );

  const connectXdefiWallet = useCallback(
    async (chains: Chain[]) => {
      await multichain().connectXDefiWallet(chains);

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain));
      });
    },
    [dispatch],
  );

  const connectBraveWallet = useCallback(
    async (chains: Chain[]) => {
      await multichain().connectBraveWallet(chains);

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain));
      });
    },
    [dispatch],
  );

  const connectTrustWalletExtension = useCallback(
    async (chain: Chain) => {
      await multichain().connectTrustWalletExtension(chain);

      dispatch(walletActions.getWalletByChain(chain));
    },
    [dispatch],
  );

  const connectMetamask = useCallback(
    async (chain: Chain) => {
      await multichain().connectMetamask(chain);

      dispatch(walletActions.getWalletByChain(chain));
    },
    [dispatch],
  );

  const connectKeplr = useCallback(async () => {
    await multichain().connectKeplr();

    dispatch(walletActions.getWalletByChain(Chain.Cosmos));
  }, [dispatch]);

  const connectTrustWallet = useCallback(
    async (chains: Chain[]) => {
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
    connectMetamask,
    connectKeplr,
    connectTrustWallet,
    connectLedger,
    refreshWalletByChain,
  };
};
