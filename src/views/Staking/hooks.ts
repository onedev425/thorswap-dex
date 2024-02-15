import { AssetValue, BaseDecimal, Chain, RequestClient, SwapKitNumber } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { stakingV2Addr, VestingType } from 'helpers/assets';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  contractConfig,
  ContractType,
  getCustomContract,
  getEtherscanContract,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

export enum StakeActions {
  Unstake = 'unstake',
  Deposit = 'deposit',
}

export const useV1ThorStakeInfo = (ethAddress?: string) => {
  const [stakedThorAmount, setStakedThorAmount] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );

  const getStakedThorAmount = useCallback(async () => {
    if (ethAddress) {
      // V1 $thor stake
      const stakingContract = await getEtherscanContract(ContractType.STAKING_THOR);
      const { amount } = await stakingContract.userInfo(0, ethAddress);
      setStakedThorAmount(SwapKitNumber.fromBigInt(amount, BaseDecimal.ETH));
    }
  }, [ethAddress]);

  useEffect(() => {
    getStakedThorAmount();
  }, [getStakedThorAmount]);

  return { stakedThorAmount, hasStakedV1Thor: stakedThorAmount.gt(0) };
};

const getStakedThorAmount = async () => {
  const contract = await getCustomContract(stakingV2Addr[VestingType.THOR]);
  const stakedThorAmount = await contract.balanceOf(stakingV2Addr[VestingType.VTHOR]);

  return SwapKitNumber.fromBigInt(stakedThorAmount, 18);
};

export const getVthorState = async (methodName: string, args?: FixMe[]) => {
  try {
    const contract = await getCustomContract(
      contractConfig[ContractType.VTHOR].address,
      contractConfig[ContractType.VTHOR].abi,
    );
    const value = (await contract[methodName](...(args ?? []))) || 0;

    return SwapKitNumber.fromBigInt(value, BaseDecimal.ETH);
  } catch (_) {
    return new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH });
  }
};

export const useVthorUtil = () => {
  const appDispatch = useAppDispatch();
  const [thorStaked, setThorStaked] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [circulatingSupply, setCirculatingSupply] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [vthorTS, setVthorTS] = useState(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));
  const [thorRedeemable, setTHORRedeemable] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [vthorBalance, setVthorBalance] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );

  const { getWalletAddress } = useWallet();
  const ethAddr = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const getThorStakedInfo = useCallback(async () => {
    const staked = await getStakedThorAmount();
    setThorStaked(staked);

    const circulating = await RequestClient.get<number>(
      'https://api.thorswap.net/aggregator/stats/supply/circulating',
    );

    setCirculatingSupply(new SwapKitNumber(circulating));
  }, []);

  const getVthorTS = useCallback(async () => {
    const res = await getVthorState('totalSupply');
    setVthorTS(res);
  }, []);

  const getRate = useCallback(
    (isReverted = false) =>
      isReverted
        ? thorStaked.eqValue(0)
          ? new SwapKitNumber(1)
          : vthorTS.div(thorStaked)
        : vthorTS.eqValue(0)
          ? new SwapKitNumber(1)
          : thorStaked.div(vthorTS),
    [thorStaked, vthorTS],
  );

  const getRateString = useCallback(
    (isReverted = false) => {
      const rate = getRate(!isReverted);

      return isReverted
        ? `1 vTHOR = ${rate.toSignificant(4)} THOR`
        : `1 THOR = ${rate.toSignificant(4)} vTHOR`;
    },
    [getRate],
  );

  const approveTHOR = useCallback(async () => {
    if (!ethAddr) return;

    const thorAsset = AssetValue.fromChainOrSignature('ETH.THOR');
    const id = v4();

    appDispatch(
      addTransaction({
        id,
        from: ethAddr,
        label: `${t('txManager.approve')} ${thorAsset.ticker}`,
        inChain: thorAsset.chain,
        type: TransactionType.ETH_APPROVAL,
      }),
    );

    const { approveAssetValue } = await (await import('services/swapKit')).getSwapKitClient();

    try {
      const txid = await approveAssetValue(thorAsset, stakingV2Addr[VestingType.VTHOR]);

      if (typeof txid === 'string') {
        appDispatch(updateTransaction({ id, txid }));
      }
    } catch (error) {
      logException(error as Error);
      appDispatch(completeTransaction({ id, status: 'error' }));
      showErrorToast(t('notification.approveFailed'), undefined, undefined, error as Error);
    }
  }, [ethAddr, appDispatch]);

  const previewDeposit = useCallback(
    (inputAmount: SwapKitNumber) => inputAmount.mul(getRate(true)).toSignificant(),
    [getRate],
  );

  const previewRedeem = useCallback(
    (inputAmount: SwapKitNumber) => inputAmount.mul(getRate()).toSignificant(),
    [getRate],
  );

  const getVthorBalance = useCallback(async () => {
    if (!ethAddr) {
      setVthorBalance(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));
      return;
    }

    const res = await getVthorState('balanceOf', [ethAddr]);

    setVthorBalance(res);
  }, [ethAddr]);

  const getTHORRedeemable = useCallback(async () => {
    if (!ethAddr) {
      setTHORRedeemable(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));
      return;
    }

    const vThorBal = await getVthorState('balanceOf', [ethAddr]);
    const res = await getVthorState('previewRedeem', [vThorBal]);

    return setTHORRedeemable(res);
  }, [ethAddr]);

  const handleRefresh = useCallback(() => {
    getThorStakedInfo();
    getVthorTS();
    getTHORRedeemable();

    if (ethAddr) getVthorBalance();
  }, [getThorStakedInfo, getVthorTS, getTHORRedeemable, ethAddr, getVthorBalance]);

  const stakeThor = useCallback(
    async (stakeAmount: SwapKitNumber, receiverAddr: string) => {
      if (stakeAmount.eq(0)) return;

      const id = v4();
      const thorAsset = AssetValue.fromChainOrSignature('ETH.THOR', stakeAmount.getValue('string'));
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.stake')} ${stakeAmount.toSignificant()} ${thorAsset.ticker}`,
          inChain: thorAsset.chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      if (!ethAddr) throw new Error('No ETH address');

      let hash;
      try {
        // TODO(@Chillios): rewrite to call from swapkit
        hash = (await triggerContractCall(ContractType.VTHOR, 'deposit', [
          stakeAmount.getBaseValue('bigint'),
          receiverAddr,
        ])) as string;
      } catch (error: any) {
        showErrorToast(
          t('notification.stakeFailed'),
          error?.message || error?.toString(),
          undefined,
          error as Error,
        );
        return appDispatch(completeTransaction({ id, status: 'error' }));
      }

      hash
        ? appDispatch(updateTransaction({ id, txid: hash }))
        : appDispatch(completeTransaction({ id, status: 'mined' }));
    },
    [appDispatch, ethAddr],
  );

  const unstakeThor = useCallback(
    async (unstakeAmount: SwapKitNumber, receiverAddr: string) => {
      const vthorAsset = AssetValue.fromChainOrSignature(
        'ETH.vTHOR',
        unstakeAmount.getValue('string'),
      );

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          label: `${t('txManager.unstake')} ${unstakeAmount.toSignificant()} ${vthorAsset.ticker}`,
          inChain: vthorAsset.chain,
          type: TransactionType.ETH_STATUS,
        }),
      );

      let hash;
      try {
        hash = (await triggerContractCall(ContractType.VTHOR, 'redeem', [
          unstakeAmount.getBaseValue('bigint'),
          receiverAddr,
          receiverAddr,
        ])) as string;
      } catch (error: any) {
        showErrorToast(
          t('notification.stakeFailed'),
          error?.message || error?.toString(),
          undefined,
          error as Error,
        );
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
    stakePercentageRate: circulatingSupply.gt(0)
      ? thorStaked.div(circulatingSupply).mul(100).getValue('number').toFixed(2)
      : 0,
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
