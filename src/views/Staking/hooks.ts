import { BigNumber } from '@ethersproject/bignumber';
import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { showErrorToast } from 'components/Toast';
import { stakingV2Addr, VestingType } from 'helpers/assets';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useState } from 'react';
import {
  contractConfig,
  ContractType,
  fromWei,
  getCustomContract,
  getEtherscanContract,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

export enum StakeActions {
  Unstake = 'unstake',
  Deposit = 'deposit',
}

export const useV1ThorStakeInfo = (ethAddress?: string) => {
  const [stakedThorAmount, setStakedThorAmount] = useState<null | BigNumber>(null);

  const getStakedThorAmount = useCallback(async () => {
    if (ethAddress) {
      // V1 $thor stake
      const stakingContract = getEtherscanContract(ContractType.STAKING_THOR);
      const { amount } = await stakingContract.userInfo(0, ethAddress);

      setStakedThorAmount(amount as BigNumber);
    }
  }, [ethAddress]);

  useEffect(() => {
    getStakedThorAmount();
  }, [getStakedThorAmount]);

  const hasStakedV1Thor = !!stakedThorAmount && BigNumber.from(stakedThorAmount).gt(0);

  return { stakedThorAmount, hasStakedV1Thor };
};

const getStakedThorAmount = async () => {
  const contract = getCustomContract(stakingV2Addr[VestingType.THOR]);
  const stakedThorAmount = await contract.balanceOf(stakingV2Addr[VestingType.VTHOR]);

  return stakedThorAmount;
};

export const getVthorState = async (methodName: string, args?: FixMe[]) => {
  const contract = getCustomContract(
    contractConfig[ContractType.VTHOR].address,
    contractConfig[ContractType.VTHOR].abi,
  );
  const resp = await contract[methodName](...(args ?? []));

  return resp;
};

export const useVthorUtil = () => {
  const appDispatch = useAppDispatch();
  const [thorStaked, setThorStaked] = useState(BigNumber.from(0));
  const [vthorTS, setVthorTS] = useState(BigNumber.from(0));
  const [thorRedeemable, setTHORRedeemable] = useState(0);
  const [vthorBalance, setVthorBalance] = useState(BigNumber.from(0));

  const { wallet } = useWallet();

  const ethAddr = wallet?.ETH?.address;

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

      if (isReverted) {
        return vthorTSNum === 0 ? 1 : thorStakedNum / vthorTSNum;
      } else {
        return thorStakedNum === 0 ? 1 : vthorTSNum / thorStakedNum;
      }
    },
    [thorStaked, vthorTS],
  );

  const getRateString = useCallback(
    (isReverted = false) => {
      const thorStakedNum = fromWei(thorStaked);
      const vthorTSNum = fromWei(vthorTS);

      const rate = toOptionalFixed(getRate(isReverted));

      if (!isReverted) {
        return thorStakedNum === 0 ? '1 THOR = 1 vTHOR' : `1 THOR = ${rate} vTHOR`;
      }

      return vthorTSNum === 0 ? '1 vTHOR = 1 THOR' : `1 vTHOR = ${rate} THOR`;
    },
    [thorStaked, vthorTS, getRate],
  );

  const approveTHOR = useCallback(async () => {
    if (!ethAddr) return;

    const thorAsset = getSignatureAssetFor('ETH_THOR');
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

    const { approveAssetForContract } = await (await import('services/swapKit')).getSwapKitClient();

    try {
      const txid = await approveAssetForContract(thorAsset, stakingV2Addr[VestingType.VTHOR]);

      if (typeof txid === 'string') {
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
    getTHORRedeemable();

    if (ethAddr) getVthorBalance();
  }, [getThorStakedInfo, getVthorTS, getTHORRedeemable, ethAddr, getVthorBalance]);

  const stakeThor = useCallback(
    async (stakeAmount: BigNumber, receiverAddr: string) => {
      const amount = Number(fromWei(stakeAmount).toFixed(4));
      if (amount === 0) return;

      const id = v4();
      const thorAsset = getSignatureAssetFor('ETH_THOR');
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.stake')} ${amount} ${thorAsset.name}`,
          inChain: thorAsset.L1Chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      if (!ethAddr) throw new Error('No ETH address');

      let hash;
      try {
        // TODO: rewrite to call from swapkit
        hash = (await triggerContractCall(ContractType.VTHOR, 'deposit', [
          stakeAmount,
          receiverAddr,
        ])) as string;
      } catch (error: any) {
        showErrorToast(t('notification.stakeFailed'), error?.message || error?.toString());
        return appDispatch(completeTransaction({ id, status: 'error' }));
      }

      hash
        ? appDispatch(updateTransaction({ id, txid: hash }))
        : appDispatch(completeTransaction({ id, status: 'mined' }));
    },
    [appDispatch, ethAddr],
  );

  const unstakeThor = useCallback(
    async (unstakeAmount: BigNumber, receiverAddr: string) => {
      const vthorAsset = getSignatureAssetFor('ETH_VTHOR');
      const amount = Number(fromWei(unstakeAmount).toFixed(4)) / 1;

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.unstake')} ${amount} ${vthorAsset.name}`,
          inChain: vthorAsset.L1Chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      let hash;
      try {
        hash = (await triggerContractCall(ContractType.VTHOR, 'redeem', [
          unstakeAmount,
          receiverAddr,
          receiverAddr,
        ])) as string;
      } catch (error: any) {
        showErrorToast(t('notification.stakeFailed'), error?.message || error?.toString());
        return appDispatch(completeTransaction({ id, status: 'error' }));
      }

      hash
        ? appDispatch(updateTransaction({ id, txid: hash }))
        : appDispatch(completeTransaction({ id, status: 'mined' }));
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
    getRateString,
    approveTHOR,
    handleRefresh,
    previewDeposit,
    previewRedeem,
    stakeThor,
    unstakeThor,
  };
};
