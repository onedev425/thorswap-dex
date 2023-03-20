import { BigNumber } from '@ethersproject/bignumber';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import dayjs from 'dayjs';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContractType,
  fromWei,
  getEtherscanContract,
  toWei,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { useTransactionsState } from 'store/transactions/hooks';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import {
  defaultVestingInfo,
  vestingAssets,
  VestingScheduleInfo,
  VestingType,
} from 'views/Vesting/types';

export const useVesting = ({ fetchVestingStatus }: { fetchVestingStatus?: boolean } = {}) => {
  const appDispatch = useAppDispatch();
  const [vestingAction, setVestingAction] = useState(VestingType.THOR);
  const [vestingInfo, setVestingInfo] = useState<VestingScheduleInfo>(defaultVestingInfo);
  const [isFetching, setIsFetching] = useState(false);
  const [hasVestingAlloc, setVestingAlloc] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(Amount.fromNormalAmount(0));

  const { wallet, setIsConnectModalOpen } = useWallet();
  const { numberOfPendingApprovals } = useTransactionsState();

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

  const getVestingInfo = useCallback(
    async (type: VestingType) => {
      try {
        const contractType =
          type === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING;
        const vestingContract = getEtherscanContract(contractType);

        const [
          totalVestedAmount,
          totalClaimedAmount,
          startTime,
          vestingPeriod,
          cliff,
          initialRelease,
        ] = (await vestingContract.vestingSchedule(ethAddr)) || [];
        const claimableAmount = await vestingContract.claimableAmount(ethAddr);

        const info = {
          totalVestedAmount: fromWei(totalVestedAmount).toString(),
          totalClaimedAmount: fromWei(totalClaimedAmount),
          startTime: dayjs.unix(startTime).format('YYYY-MM-DD HH:MM:ss'),
          vestingPeriod: dayjs.duration(vestingPeriod * 1000).asDays() / 365,
          cliff: dayjs.duration(cliff * 1000).asDays() / 30,
          initialRelease: fromWei(initialRelease).toString(),
          claimableAmount: fromWei(claimableAmount),
          hasAlloc:
            BigNumber.from(totalVestedAmount).gt(0) || BigNumber.from(totalClaimedAmount).gt(0),
        };

        setVestingInfo(info);

        return info;
      } catch (error) {
        console.error(error);
      }
    },
    [ethAddr],
  );

  const handleChangePercent = useCallback(
    (percent: number) => {
      setTokenAmount(Amount.fromNormalAmount((vestingInfo.claimableAmount * percent) / 100));
    },
    [vestingInfo],
  );

  const handleChangeTokenAmount = useCallback((value: Amount) => {
    setTokenAmount(value);
  }, []);

  const handleVestingInfo = useCallback(async () => {
    setIsFetching(true);

    try {
      if (ethAddr) await getVestingInfo(vestingAction);
      else setVestingInfo(defaultVestingInfo);
    } catch {
      setVestingInfo(defaultVestingInfo);
    }

    setIsFetching(false);
  }, [ethAddr, getVestingInfo, vestingAction]);

  const handleClaim = useCallback(async () => {
    if (ethAddr) {
      const currentClaimableAmount = toWei(tokenAmount.assetAmount.toNumber());

      setIsClaiming(true);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          inChain: Chain.Ethereum,
          type: TransactionType.ETH_STATUS,
          label: `${t('txManager.claim')} ${toOptionalFixed(fromWei(currentClaimableAmount))} ${
            vestingAssets[vestingAction].name
          }`,
        }),
      );

      try {
        const hash = await triggerContractCall(
          vestingAction === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING,
          'claim',
          [currentClaimableAmount],
        );

        if (hash) {
          appDispatch(updateTransaction({ id, txid: hash }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'), t('common.defaultErrMsg'));
      }

      setIsClaiming(false);
    } else {
      setIsConnectModalOpen(true);
    }
  }, [ethAddr, tokenAmount.assetAmount, appDispatch, vestingAction, setIsConnectModalOpen]);

  useEffect(() => {
    handleVestingInfo();
  }, [handleVestingInfo, numberOfPendingApprovals]);

  const fetchVestingAlloc = useCallback(async () => {
    if (!ethAddr || !fetchVestingStatus) return;
    const promises = [getVestingInfo(VestingType.THOR), getVestingInfo(VestingType.VTHOR)];
    const infos = await Promise.all(promises);
    setVestingAlloc(infos?.[0]?.hasAlloc || infos?.[1]?.hasAlloc || false);
  }, [ethAddr, fetchVestingStatus, getVestingInfo]);

  useEffect(() => {
    fetchVestingAlloc();
  }, [fetchVestingAlloc]);

  return {
    setVestingAction,
    vestingInfo,
    isFetching,
    handleVestingInfo,
    handleClaim,
    isClaiming,
    ethAddr,
    vestingAction,
    tokenAmount,
    setIsConnectModalOpen,
    handleChangePercent,
    handleChangeTokenAmount,
    hasVestingAlloc,
  };
};
