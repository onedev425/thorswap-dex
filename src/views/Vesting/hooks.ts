import { BaseDecimal, Chain, SwapKitNumber } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { useWalletDispatch } from 'context/wallet/WalletProvider';
import dayjs from 'dayjs';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { contractConfig, ContractType, triggerContractCall } from 'services/contract';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { useTransactionsState } from 'store/transactions/hooks';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';
import { VestingType } from 'views/Vesting/types';

const defaultVestingInfo = {
  totalVestedAmount: 'N/A',
  totalClaimedAmount: new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  startTime: '-',
  vestingPeriod: 0,
  cliff: 0,
  initialRelease: '-',
  claimableAmount: new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  hasAlloc: false,
};
const initialVestingInfo = {
  [VestingType.THOR]: defaultVestingInfo,
  [VestingType.VTHOR]: defaultVestingInfo,
};

let contractCallInProgress = false;

export const useVesting = ({ onlyCheckAlloc }: { onlyCheckAlloc?: boolean } = {}) => {
  const { getWalletAddress } = useWallet();
  const appDispatch = useAppDispatch();
  const walletDispatch = useWalletDispatch();
  const [vestingInfo, setVestingInfo] = useState(initialVestingInfo);
  const [isLoading, setIsLoading] = useState(false);
  const { numberOfPendingApprovals } = useTransactionsState();
  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const checkAlloc = useCallback(async () => {
    if (!ethAddress || contractCallInProgress) return;

    const { connectedWallets } = await (await import('services/swapKit')).getSwapKitClient();
    const { getProvider } = await import('@swapkit/toolbox-evm');
    try {
      contractCallInProgress = true;
      const { abi: thorVesting, address: thorAddress } = contractConfig['vesting'];
      const { abi: vthorVesting, address: vthorAddress } = contractConfig['vthor_vesting'];
      const callParams = {
        callProvider: getProvider(Chain.Ethereum),
        funcParams: [ethAddress, {}],
        from: ethAddress,
        funcName: 'claimableAmount',
      };

      let hasVestingAlloc = false;

      await connectedWallets.ETH?.call({
        ...callParams,
        abi: thorVesting,
        contractAddress: thorAddress,
      }).then((amount) => {
        const hasVesting = (typeof amount === 'bigint' && amount > 0) || amount?.toString() !== '0';
        hasVesting && (hasVestingAlloc = true);
      });

      await connectedWallets.ETH?.call({
        ...callParams,
        abi: vthorVesting,
        contractAddress: vthorAddress,
      }).then((amount) => {
        const hasVesting = (typeof amount === 'bigint' && amount > 0) || amount?.toString() !== '0';
        hasVesting && (hasVestingAlloc = true);
      });

      walletDispatch({ type: 'setHasVestingAlloc', payload: hasVestingAlloc });
    } catch (error) {
      console.error(error);
    } finally {
      contractCallInProgress = false;
    }
  }, [ethAddress, walletDispatch]);

  const getContractVestingInfo = useCallback(
    async (vestingType: VestingType) => {
      if (!ethAddress) return defaultVestingInfo;

      const { connectedWallets } = await (await import('services/swapKit')).getSwapKitClient();
      const { getProvider } = await import('@swapkit/toolbox-evm');
      const contractType = vestingType === VestingType.THOR ? 'vesting' : 'vthor_vesting';
      const { abi, address } = contractConfig[contractType];
      const callParams = {
        callProvider: getProvider(Chain.Ethereum),
        from: ethAddress,
        funcParams: [ethAddress, {}],
      };

      const [
        totalVestedAmount,
        totalClaimedAmount,
        startTime,
        vestingPeriod,
        cliff,
        initialRelease,
      ] =
        (await connectedWallets.ETH?.call({
          ...callParams,
          abi,
          contractAddress: address,
          funcName: 'vestingSchedule',
        })) || ([] as any);

      const claimableAmount = (await connectedWallets.ETH?.call({
        ...callParams,
        abi,
        contractAddress: address,
        funcName: 'claimableAmount',
      })) as bigint;

      const totalVested = new SwapKitNumber({
        value: totalVestedAmount?.toString() || '0',
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const totalClaimed = new SwapKitNumber({
        value: totalClaimedAmount?.toString() || '0',
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const claimable = new SwapKitNumber({
        value: claimableAmount?.toString() || '0',
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const hasAlloc = totalVested.gt(0) || totalClaimed.gt(0) || claimable.gt(0);

      return {
        totalVestedAmount: totalVested.getValue('string'),
        totalClaimedAmount: totalClaimed,
        startTime: dayjs.unix(startTime.toString()).format('YYYY-MM-DD HH:MM:ss'),
        vestingPeriod: dayjs.duration(vestingPeriod.toString() * 1000).asDays() / 365,
        cliff: dayjs.duration(cliff.toString() * 1000).asDays() / 30,
        initialRelease: (initialRelease || '0').toString(),
        claimableAmount: claimable,
        hasAlloc,
      };
    },
    [ethAddress],
  );

  const loadVestingInfo = useCallback(async () => {
    setIsLoading(true);

    try {
      const thorVestingInfo = await getContractVestingInfo(VestingType.THOR);
      const vthorVestingInfo = await getContractVestingInfo(VestingType.VTHOR);
      walletDispatch({
        type: 'setHasVestingAlloc',
        payload: thorVestingInfo.hasAlloc || vthorVestingInfo.hasAlloc,
      });

      setVestingInfo({
        [VestingType.THOR]: thorVestingInfo,
        [VestingType.VTHOR]: vthorVestingInfo,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getContractVestingInfo, walletDispatch]);

  const handleClaim = useCallback(
    async ({ vestingAction, amount }: { vestingAction: VestingType; amount: SwapKitNumber }) => {
      if (amount.lte(0)) return;

      setIsLoading(true);
      const id = v4();

      try {
        const currentClaimableAmount = amount.getValue('number');

        appDispatch(
          addTransaction({
            id,
            inChain: Chain.Ethereum,
            type: TransactionType.ETH_STATUS,
            label: `${t('txManager.claim')} ${toOptionalFixed(
              currentClaimableAmount,
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

  return { checkAlloc, isLoading, vestingInfo, loadVestingInfo, ethAddress, handleClaim };
};
