import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { fromByteArray } from 'base64-js';
import { showErrorToast } from 'components/Toast';
import { useCallback, useMemo } from 'react';
import {
  getMultisigAddress,
  multisig,
  MultisigDepositTxParams,
  MultisigTransferTxParams,
  Signer,
} from 'services/multisig';
import { loadMultisigBalances } from 'store/multisig/actions';
import { actions } from 'store/multisig/slice';
import { MultisigMember, MultisigWallet } from 'store/multisig/types';
import { useAppDispatch, useAppSelector } from 'store/store';

export const useMultisig = () => {
  const { address, members, treshold } = useAppSelector((state) => state.multisig);

  const { wallet, privateKey, publicKey } = useAppSelector((state) => state.wallet);

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

    return existingAddress === address ? address : multisig.createMultisigWallet(members, treshold);
  }, [address, members, treshold]);

  const getSignersSequence = useCallback(
    (signers: MultisigMember[]) => {
      return multisig.getSignersSequence(members, signers);
    },
    [members],
  );

  const createTransferTx = useCallback(
    async (txParams: MultisigTransferTxParams, signers: MultisigMember[]) => {
      await initMultisigWallet();
      const signersSequece = getSignersSequence(signers);

      try {
        return await multisig.buildTransferTx(txParams, signersSequece);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [getSignersSequence, initMultisigWallet],
  );

  const createDepositTx = useCallback(
    async (txParams: MultisigDepositTxParams, signers: MultisigMember[]) => {
      initMultisigWallet();
      const signersSequece = getSignersSequence(signers);

      try {
        return await multisig.buildDepositTx(txParams, signersSequece);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [getSignersSequence, initMultisigWallet],
  );

  const importTx = useCallback(
    async (txStr: string) => {
      initMultisigWallet();

      try {
        return await multisig.importMultisigTx(txStr);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet],
  );

  const signTx = useCallback(
    async (tx: string) => {
      initMultisigWallet();

      try {
        return await multisig.signMultisigTx(privateKey, tx);
      } catch (error: NotWorth) {
        console.error(error);
        showErrorToast(error.message);
      }
    },
    [initMultisigWallet, privateKey],
  );

  const broadcastTx = useCallback(
    async (tx: string, signers: Signer[]) => {
      initMultisigWallet();

      try {
        return await multisig.broadcastMultisigTx(tx, signers);
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
    (asset: Asset) => {
      if (!address) return false;
      return asset.L1Chain === Chain.THORChain;
    },
    [address],
  );

  const walletPubKey = useMemo(
    () => (publicKey ? fromByteArray(publicKey.key) : ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members, wallet?.THOR?.address],
  );

  return {
    ...multisigActions,
    initMultisigWallet,
    createTransferTx,
    createDepositTx,
    importTx,
    signTx,
    broadcastTx,
    loadBalances,
    isMultsigActivated,
    isWalletAssetConnected,
    walletPubKey,
    isConnected: !!address,
  };
};
