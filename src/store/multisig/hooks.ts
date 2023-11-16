import type { AssetValue } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import type { Signer } from '@swapkit/toolbox-cosmos';
import { showErrorToast } from 'components/Toast';
import { useCallback, useMemo } from 'react';
import type { MultisigDepositTxParams, MultisigTransferTxParams } from 'services/multisig';
import { getMultisigAddress, multisig } from 'services/multisig';
import { loadMultisigBalances } from 'store/multisig/actions';
import { actions } from 'store/multisig/slice';
import type { MultisigWallet } from 'store/multisig/types';
import { useAppDispatch, useAppSelector } from 'store/store';
import { useWallet } from 'store/wallet/hooks';

export const useMultisig = () => {
  const { address, members, threshold } = useAppSelector(({ multisig }) => multisig);
  const { wallet, pubKey } = useAppSelector(({ wallet }) => wallet);
  const { phrase } = useWallet();
  const dispatch = useAppDispatch();

  const multisigActions = useMemo(
    () => ({
      addMultisigWallet: (wallet: MultisigWallet) => {
        dispatch(actions.addMultisigWallet(wallet));
      },
      clearMultisigWallet: () => {
        dispatch(actions.clearMultisigWallet());
        multisig.clearMultisigWallet();
      },
    }),
    [dispatch],
  );

  const initMultisigWallet = useCallback(() => {
    const existingAddress = getMultisigAddress();

    return existingAddress === address
      ? address
      : multisig.createMultisigWallet(members, threshold);
  }, [address, members, threshold]);

  const createTransferTx = useCallback(
    async (txParams: MultisigTransferTxParams) => {
      await initMultisigWallet();

      try {
        return await multisig.buildTransferTx(txParams);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet],
  );

  const createDepositTx = useCallback(
    async (txParams: MultisigDepositTxParams) => {
      initMultisigWallet();

      try {
        return await multisig.buildDepositTx(txParams);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet],
  );

  const signTx = useCallback(
    async (tx: any) => {
      initMultisigWallet();

      try {
        return await multisig.signMultisigTx(phrase, tx);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet, phrase],
  );

  const broadcastTx = useCallback(
    async (tx: string, signers: Signer[], threshold: number, bodyBytes: number[]) => {
      initMultisigWallet();

      try {
        return await multisig.broadcastMultisigTx(
          tx,
          signers,
          threshold,
          Uint8Array.from(bodyBytes),
        );
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet],
  );

  const loadBalances = useCallback(async () => {
    initMultisigWallet();

    if (getMultisigAddress()) {
      dispatch(loadMultisigBalances());
    }
  }, [dispatch, initMultisigWallet]);

  const isMultsigActivated = useCallback(() => {
    initMultisigWallet();

    return multisig.isMultisigInitialized();
  }, [initMultisigWallet]);

  const isWalletAssetConnected = useCallback(
    (asset: AssetValue) => {
      if (!address) return false;
      return asset.chain === Chain.THORChain;
    },
    [address],
  );

  const walletPubKey = useMemo(
    () => pubKey,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members, wallet?.THOR?.address],
  );

  return {
    ...multisigActions,
    initMultisigWallet,
    createTransferTx,
    createDepositTx,
    signTx,
    broadcastTx,
    loadBalances,
    isMultsigActivated,
    isWalletAssetConnected,
    walletPubKey,
    isConnected: !!address,
  };
};
