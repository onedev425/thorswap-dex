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

export const useVesting = () => {
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
      if (ethAddr) {
        try {
          const vestingContract = getEtherscanContract(
            type === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING,
          );

          const totalAlloc = await vestingContract.vestingSchedule(ethAddr);

          const claimableAmount = await vestingContract.claimableAmount(ethAddr);
          const info = {
            totalVestedAmount: fromWei(totalAlloc[0]).toString(),
            totalClaimedAmount: fromWei(totalAlloc[1]),
            startTime: dayjs.unix(totalAlloc[2]).format('YYYY-MM-DD HH:MM:ss'),
            vestingPeriod: dayjs.duration(totalAlloc[3] * 1000).asDays() / 365,
            cliff: dayjs.duration(totalAlloc[4] * 1000).asDays() / 30,
            initialRelease: fromWei(totalAlloc[5]).toString(),
            claimableAmount: fromWei(claimableAmount),
            hasAlloc: BigNumber.from(totalAlloc[0]).gt(0) || BigNumber.from(totalAlloc[1]).gt(0),
          };

          setVestingInfo(info);

          return info;
        } catch (error) {
          console.error(error);
        }
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

  const fetchVestingAlloc = useCallback(async () => {
    const promises = [getVestingInfo(VestingType.THOR), getVestingInfo(VestingType.VTHOR)];
    const infos = await Promise.all(promises);
    setVestingAlloc(infos?.[0]?.hasAlloc || infos?.[1]?.hasAlloc || false);
  }, [getVestingInfo]);

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
        const response = await triggerContractCall(
          vestingAction === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING,
          'claim',
          [currentClaimableAmount],
        );

        if (response?.hash) {
          appDispatch(updateTransaction({ id, txid: response.hash }));
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
    fetchVestingAlloc();
  }, [handleVestingInfo, fetchVestingAlloc, numberOfPendingApprovals]);

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
