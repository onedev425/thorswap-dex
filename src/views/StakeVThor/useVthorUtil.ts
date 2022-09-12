// import { ETH_DECIMAL } from '@thorswap-lib/multichain-core'
import { BigNumber } from '@ethersproject/bignumber';
import { showErrorToast } from 'components/Toast';
import { getV2Address, getV2Asset, VestingType } from 'helpers/assets';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useState } from 'react';
import { ContractType, fromWei, triggerContractCall } from 'services/contract';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import * as walletActions from 'store/wallet/actions';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

import { getStakedThorAmount, getVthorState } from './utils';

export const useVthorUtil = () => {
  const appDispatch = useAppDispatch();
  const [thorStaked, setThorStaked] = useState(BigNumber.from(0));
  const [vthorTS, setVthorTS] = useState(BigNumber.from(0));
  const [thorRedeemable, setTHORRedeemable] = useState(0);
  const [vthorBalance, setVthorBalance] = useState(BigNumber.from(0));

  const { wallet } = useWallet();

  const ethAddr = wallet?.ETH?.address;

  const getApprovalStatus = useCallback(async () => {
    appDispatch(walletActions.getIsVthorApproved());
  }, [appDispatch]);

  const getThorStakedInfo = useCallback(async () => {
    const res = await getStakedThorAmount().catch(() => BigNumber.from(0));

    setThorStaked(res);
  }, []);

  const getVthorTS = useCallback(async () => {
    const res = await getVthorState('totalSupply').catch(() => BigNumber.from(0));
    setVthorTS(res);
  }, []);

  const getRate = useCallback(
    (isReverted = false) => {
      const thorStakedNum = fromWei(thorStaked);
      const vthorTSNum = fromWei(vthorTS);

      if (!isReverted) {
        return thorStakedNum === 0
          ? '1 THOR = 1 vTHOR'
          : `1 THOR = ${toOptionalFixed(vthorTSNum / thorStakedNum, 3)} vTHOR`;
      }

      return vthorTSNum === 0
        ? '1 vTHOR = 1 THOR'
        : `1 vTHOR = ${toOptionalFixed(thorStakedNum / vthorTSNum, 3)} THOR`;
    },
    [thorStaked, vthorTS],
  );

  const approveTHOR = useCallback(async () => {
    if (!ethAddr) return;

    const thorAsset = getV2Asset(VestingType.THOR);
    const id = v4();

    appDispatch(
      addTransaction({
        id,
        from: ethAddr,
        label: `${t('txManager.approve')} ${thorAsset.name}`,
        inChain: thorAsset.L1Chain,
        type: TransactionType.ETH_APPROVAL,
      }),
    );

    try {
      const txid = await multichain().approveAssetForStaking(
        getV2Asset(VestingType.THOR),
        getV2Address(VestingType.VTHOR),
      );

      if (txid) {
        appDispatch(updateTransaction({ id, txid }));
      }
    } catch (error) {
      console.error(error);
      appDispatch(completeTransaction({ id, status: 'error' }));
      showErrorToast(t('notification.approveFailed'));
    }
  }, [ethAddr, appDispatch]);

  const previewDeposit = useCallback(
    (inputAmount: BigNumber) => {
      const supply = fromWei(vthorTS);

      return supply === 0
        ? fromWei(inputAmount)
        : fromWei(inputAmount.mul(vthorTS).div(thorStaked));
    },
    [thorStaked, vthorTS],
  );

  const previewRedeem = useCallback(
    (inputAmount: BigNumber) => {
      const supply = fromWei(vthorTS);

      return supply === 0
        ? fromWei(inputAmount)
        : fromWei(inputAmount.mul(thorStaked).div(vthorTS));
    },
    [thorStaked, vthorTS],
  );

  const getVthorBalance = useCallback(async () => {
    if (!ethAddr) {
      setVthorBalance(BigNumber.from(0));
      return;
    }

    const res = await getVthorState('balanceOf', [ethAddr]).catch(() =>
      setVthorBalance(BigNumber.from(0)),
    );

    setVthorBalance(res);
  }, [ethAddr]);

  const getTHORRedeemable = useCallback(async () => {
    if (!ethAddr) {
      setTHORRedeemable(0);
      return;
    }

    const vThorBal = await getVthorState('balanceOf', [ethAddr]).catch(() => setTHORRedeemable(0));
    const res = await getVthorState('previewRedeem', [vThorBal]).catch(() => setTHORRedeemable(0));

    return setTHORRedeemable(fromWei(res));
  }, [ethAddr]);

  const handleRefresh = useCallback(() => {
    getThorStakedInfo();
    getVthorTS();
    getApprovalStatus();
    getTHORRedeemable();

    if (ethAddr) getVthorBalance();
  }, [
    getThorStakedInfo,
    getVthorTS,
    getApprovalStatus,
    getTHORRedeemable,
    ethAddr,
    getVthorBalance,
  ]);

  const stakeThor = useCallback(
    async (stakeAmount: BigNumber, receiverAddr: string) => {
      const amount = fromWei(stakeAmount);
      if (amount === 0) return;

      const thorAsset = getV2Asset(VestingType.THOR);
      const id = v4();
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.stake')} ${amount.toString()} ${thorAsset.name}`,
          inChain: thorAsset.L1Chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      try {
        const response = await triggerContractCall(multichain(), ContractType.VTHOR, 'deposit', [
          stakeAmount,
          receiverAddr,
        ]);

        if (response?.hash) {
          appDispatch(updateTransaction({ id, txid: response?.hash }));
        }
      } catch {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(
          t('txManager.stakeAssetFailed', {
            amount: amount.toString(),
            asset: thorAsset.ticker,
          }),
        );
      }
    },
    [appDispatch, ethAddr],
  );

  const unstakeThor = useCallback(
    async (unstakeAmount: BigNumber, receiverAddr: string) => {
      const vthorAsset = getV2Asset(VestingType.VTHOR);
      const amount = fromWei(unstakeAmount).toString();

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.stake')} ${amount.toString()} ${vthorAsset.name}`,
          inChain: vthorAsset.L1Chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      try {
        const response = await triggerContractCall(multichain(), ContractType.VTHOR, 'redeem', [
          unstakeAmount,
          receiverAddr,
          receiverAddr,
        ]);

        if (response?.hash) {
          appDispatch(updateTransaction({ id, txid: response?.hash }));
        }
      } catch {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(
          t('txManager.redeemedAmountAssetFailed', { asset: vthorAsset.ticker, amount }),
        );
      }
    },
    [appDispatch, ethAddr],
  );

  useEffect(() => handleRefresh(), [handleRefresh]);

  return {
    thorStaked,
    thorRedeemable,
    vthorBalance,
    vthorTS,
    getRate,
    approveTHOR,
    handleRefresh,
    previewDeposit,
    previewRedeem,
    stakeThor,
    unstakeThor,
  };
};
