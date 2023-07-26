import { BigNumber } from '@ethersproject/bignumber';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import dayjs from 'dayjs';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  contractConfig,
  ContractType,
  fromWei,
  toWei,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { getSwapKitClient } from 'services/swapKit';
import { useAppDispatch } from 'store/store';
import { useTransactionsState } from 'store/transactions/hooks';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { actions } from 'store/wallet/slice';
import { v4 } from 'uuid';
import { VestingType } from 'views/Vesting/types';

const defaultVestingInfo = {
  totalVestedAmount: 'N/A',
  totalClaimedAmount: 0,
  startTime: '-',
  vestingPeriod: 0,
  cliff: 0,
  initialRelease: '-',
  claimableAmount: 0,
};
const initialVestingInfo = {
  [VestingType.THOR]: defaultVestingInfo,
  [VestingType.VTHOR]: defaultVestingInfo,
};

let contractCallInProgress = false;

export const useVesting = ({ onlyCheckAlloc }: { onlyCheckAlloc?: boolean } = {}) => {
  const { wallet } = useWallet();
  const appDispatch = useAppDispatch();
  const [vestingInfo, setVestingInfo] = useState(initialVestingInfo);
  const [isLoading, setIsLoading] = useState(false);
  const { numberOfPendingApprovals } = useTransactionsState();
  const ethAddress = useMemo(() => wallet.ETH?.address, [wallet.ETH?.address]);

  const checkAlloc = useCallback(async () => {
    const skClient = await getSwapKitClient();
    if (!ethAddress) return appDispatch(actions.setHasVestingAlloc(false));
    if (contractCallInProgress) return;

    try {
      contractCallInProgress = true;
      const { abi: thorVesting, address: thorAddress } = contractConfig['vesting'];
      const { abi: vthorVesting, address: vthorAddress } = contractConfig['vthor_vesting'];

      await skClient.connectedWallets.ETH?.call({
        abi: thorVesting,
        contractAddress: thorAddress,
        funcName: 'claimableAmount',
        funcParams: [ethAddress, {}],
      }).then(
        (amount) =>
          fromWei(amount as BigNumber) > 0 && appDispatch(actions.setHasVestingAlloc(true)),
      );

      await skClient.connectedWallets.ETH?.call({
        abi: vthorVesting,
        contractAddress: vthorAddress,
        funcName: 'claimableAmount',
        funcParams: [ethAddress, {}],
      }).then(
        (amount) =>
          fromWei(amount as BigNumber) > 0 && appDispatch(actions.setHasVestingAlloc(true)),
      );
    } finally {
      contractCallInProgress = false;
    }
  }, [appDispatch, ethAddress]);

  const getContractVestingInfo = useCallback(
    async (vestingType: VestingType) => {
      const skClient = await getSwapKitClient();
      const ethAddress = skClient.getAddress(Chain.Ethereum);
      if (!ethAddress) return defaultVestingInfo;
      const contractType = vestingType === VestingType.THOR ? 'vesting' : 'vthor_vesting';
      const { abi, address } = contractConfig[contractType];

      const [
        totalVestedAmount,
        totalClaimedAmount,
        startTime,
        vestingPeriod,
        cliff,
        initialRelease,
      ] = ((await skClient.connectedWallets.ETH?.call({
        abi,
        contractAddress: address,
        funcName: 'vestingSchedule',
        funcParams: [ethAddress, {}],
      })) || []) as [BigNumber, BigNumber, number, number, number, BigNumber];
      const claimableAmount = (await skClient.connectedWallets.ETH?.call({
        abi,
        contractAddress: address,
        funcName: 'claimableAmount',
        funcParams: [ethAddress, {}],
      })) as BigNumber;

      appDispatch(
        actions.setHasVestingAlloc(
          fromWei(totalVestedAmount) > 0 ||
            fromWei(totalClaimedAmount) > 0 ||
            fromWei(claimableAmount) > 0,
        ),
      );

      return {
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
    },
    [appDispatch],
  );

  const loadVestingInfo = useCallback(async () => {
    setIsLoading(true);

    try {
      contractCallInProgress = true;
      setVestingInfo({
        [VestingType.THOR]: await getContractVestingInfo(VestingType.THOR),
        [VestingType.VTHOR]: await getContractVestingInfo(VestingType.VTHOR),
      });
    } finally {
      contractCallInProgress = false;
      setIsLoading(false);
    }
  }, [getContractVestingInfo]);

  const handleClaim = useCallback(
    async ({ vestingAction, amount }: { vestingAction: VestingType; amount: Amount }) => {
      if (amount.lte(0)) return;

      setIsLoading(true);
      const id = v4();

      try {
        const currentClaimableAmount = toWei(amount.assetAmount.toNumber());

        appDispatch(
          addTransaction({
            id,
            inChain: Chain.Ethereum,
            type: TransactionType.ETH_STATUS,
            label: `${t('txManager.claim')} ${toOptionalFixed(
              fromWei(currentClaimableAmount),
            )} ${vestingAction}`,
          }),
        );

        const txHash = (await triggerContractCall(
          vestingAction === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING,
          'claim',
          [currentClaimableAmount],
        )) as string;

        if (txHash) {
          appDispatch(updateTransaction({ id, txid: txHash }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'), t('common.defaultErrMsg'));
      } finally {
        setIsLoading(false);
      }
    },
    [appDispatch],
  );

  useEffect(() => {
    if (!onlyCheckAlloc) {
      loadVestingInfo();
    }
  }, [checkAlloc, loadVestingInfo, numberOfPendingApprovals, onlyCheckAlloc]);

  return { checkAlloc, isLoading, vestingInfo, loadVestingInfo, handleClaim };
};
