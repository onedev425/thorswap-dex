import { BigNumber } from '@ethersproject/bignumber';
import { Amount } from '@thorswap-lib/swapkit-core';
import { getProvider } from '@thorswap-lib/toolbox-evm';
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
  const ethProvider = useMemo(() => getProvider(Chain.Ethereum), []);

  const checkAlloc = useCallback(async () => {
    if (!ethAddress || contractCallInProgress) return;

    const skClient = await getSwapKitClient();
    try {
      contractCallInProgress = true;
      const { abi: thorVesting, address: thorAddress } = contractConfig['vesting'];
      const { abi: vthorVesting, address: vthorAddress } = contractConfig['vthor_vesting'];
      const callParams = {
        callProvider: ethProvider,
        funcParams: [ethAddress, {}],
        from: ethAddress,
        funcName: 'claimableAmount',
      };

      await skClient.connectedWallets.ETH?.call({
        ...callParams,
        abi: thorVesting,
        contractAddress: thorAddress,
      }).then(
        (amount) =>
          fromWei(amount as BigNumber) > 0 && appDispatch(actions.setHasVestingAlloc(true)),
      );

      await skClient.connectedWallets.ETH?.call({
        ...callParams,
        abi: vthorVesting,
        contractAddress: vthorAddress,
      }).then(
        (amount) =>
          fromWei(amount as BigNumber) > 0 && appDispatch(actions.setHasVestingAlloc(true)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      contractCallInProgress = false;
    }
  }, [appDispatch, ethAddress, ethProvider]);

  const getContractVestingInfo = useCallback(
    async (vestingType: VestingType) => {
      const skClient = await getSwapKitClient();
      if (!ethAddress) return defaultVestingInfo;
      const contractType = vestingType === VestingType.THOR ? 'vesting' : 'vthor_vesting';
      const { abi, address } = contractConfig[contractType];
      const callParams = {
        callProvider: ethProvider,
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
      ] = ((await skClient.connectedWallets.ETH?.call({
        ...callParams,
        abi,
        contractAddress: address,
        funcName: 'vestingSchedule',
      })) || []) as [BigNumber, BigNumber, number, number, number, BigNumber];
      const claimableAmount = (await skClient.connectedWallets.ETH?.call({
        ...callParams,
        abi,
        contractAddress: address,
        funcName: 'claimableAmount',
      })) as BigNumber;

      const totalVested = fromWei(totalVestedAmount || '0');
      const totalClaimed = fromWei(totalClaimedAmount || '0');
      const claimable = fromWei(claimableAmount || '0');
      const hasAlloc = totalVested > 0 || totalClaimed > 0 || claimable > 0;

      appDispatch(actions.setHasVestingAlloc(hasAlloc));

      return {
        totalVestedAmount: totalVested.toString(),
        totalClaimedAmount: totalClaimed,
        startTime: dayjs.unix(startTime).format('YYYY-MM-DD HH:MM:ss'),
        vestingPeriod: dayjs.duration(vestingPeriod * 1000).asDays() / 365,
        cliff: dayjs.duration(cliff * 1000).asDays() / 30,
        initialRelease: fromWei(initialRelease || '0').toString(),
        claimableAmount: fromWei(claimableAmount || '0'),
        hasAlloc,
      };
    },
    [ethAddress, ethProvider, appDispatch],
  );

  const loadVestingInfo = useCallback(async () => {
    setIsLoading(true);

    try {
      setVestingInfo({
        [VestingType.THOR]: await getContractVestingInfo(VestingType.THOR),
        [VestingType.VTHOR]: await getContractVestingInfo(VestingType.VTHOR),
      });
    } catch (error) {
      console.error(error);
    } finally {
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

  return { checkAlloc, isLoading, vestingInfo, loadVestingInfo, ethAddress, handleClaim };
};
