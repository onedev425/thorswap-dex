import { Text } from '@chakra-ui/react';
import type { AssetValue } from '@swapkit/core';
import { SwapKitNumber } from '@swapkit/core';
import { Box, Button, Modal } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { Input } from 'components/Input';
import { PercentSelect } from 'components/PercentSelect/PercentSelect';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { useCallback, useEffect, useState } from 'react';
import type { ContractType } from 'services/contract';
import { getContractAddress } from 'services/contract';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { FarmActionType } from '../types';

const actionNameKey: Record<FarmActionType, string> = {
  [FarmActionType.DEPOSIT]: 'views.staking.depositAction',
  [FarmActionType.CLAIM]: 'views.staking.harvestAction',
  [FarmActionType.EXIT]: 'views.staking.exitAction',
};

type Props = {
  isOpened: boolean;
  type: FarmActionType;
  tokenBalance: SwapKitNumber;
  stakedAmount: SwapKitNumber;
  claimableAmount: SwapKitNumber;
  lpAsset: AssetValue;
  contractType: ContractType;
  onConfirm: (tokenAmount: SwapKitNumber) => void;
  onCancel: () => void;
};

export const StakeConfirmModal = ({
  isOpened,
  type,
  contractType,
  lpAsset,
  tokenBalance,
  stakedAmount,
  claimableAmount,
  onConfirm,
  onCancel,
}: Props) => {
  const { hasWallet } = useWallet();
  const appDispatch = useAppDispatch();
  const [amount, setAmount] = useState(new SwapKitNumber({ value: 0, decimal: lpAsset.decimal }));
  const { isApproved } = useIsAssetApproved({
    assetValue: lpAsset.add(amount),
    contract: getContractAddress(contractType).address,
  });

  const actionLabel = t(actionNameKey[type]);
  const isClaim = type === FarmActionType.CLAIM;

  const handleChangeAmount = useCallback(
    (percent: number) => {
      if (type === FarmActionType.DEPOSIT) {
        setAmount(tokenBalance.mul(percent).div(100));
      } else if (type === FarmActionType.CLAIM) {
        setAmount(claimableAmount.mul(percent).div(100));
      } else if (type === FarmActionType.EXIT) {
        setAmount(stakedAmount.mul(percent).div(100));
      }
    },
    [type, tokenBalance, claimableAmount, stakedAmount],
  );

  const onAmountUpdate = useCallback(
    (value: string) => {
      setAmount(new SwapKitNumber({ value, decimal: lpAsset.decimal }));
    },
    [lpAsset.decimal],
  );

  const onPercentSelect = useCallback(
    (val: number) => {
      handleChangeAmount(val);
    },
    [handleChangeAmount],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(amount);

    onCancel();
  }, [amount, onCancel, onConfirm]);

  const handleConfirmApprove = useCallback(async () => {
    if (hasWallet) {
      onCancel();
      const id = v4();
      appDispatch(
        addTransaction({
          id,
          label: `${t('txManager.approve')} ${lpAsset.ticker}`,
          inChain: lpAsset.chain,
          type: TransactionType.ETH_APPROVAL,
        }),
      );

      const { approveAssetValue } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await approveAssetValue(lpAsset, getContractAddress(contractType).address);

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error: NotWorth) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'), undefined, undefined, error as Error);
      }
    }
  }, [hasWallet, onCancel, appDispatch, lpAsset, contractType]);

  useEffect(() => {
    handleChangeAmount(100);
  }, [handleChangeAmount]);

  return (
    <Modal isOpened={isOpened} onClose={onCancel} title={actionLabel}>
      <Box col className="w-full md:w-atuo md:!min-w-[350px]" flex={1}>
        <InfoRow
          label={t('views.staking.tokenBalance')}
          value={tokenBalance.gt(0) ? tokenBalance.toFixed(4) : 'N/A'}
        />
        <InfoRow
          label={t('views.staking.tokenStaked')}
          value={stakedAmount.gt(0) ? stakedAmount.toFixed(4) : 'N/A'}
        />
        <InfoRow
          label={t('views.staking.claimable')}
          value={claimableAmount.gt(0) ? claimableAmount.toFixed(2) : 'N/A'}
        />

        {!isClaim && (
          <>
            <Box alignCenter className="gap-3 !mt-8">
              <Text>
                {t('views.staking.stakeActionAmount', {
                  stakeAction: actionLabel,
                })}
              </Text>
              <Input
                border="rounded"
                className="text-right"
                onChange={(e) => onAmountUpdate(e.target.value)}
                value={amount.getValue('string')}
              />
            </Box>

            <Box className="!mt-4 flex-1">
              <PercentSelect onSelect={onPercentSelect} options={[25, 50, 75, 100]} />
            </Box>
          </>
        )}

        <Box className="gap-3 !mt-8">
          {type === FarmActionType.DEPOSIT && isApproved === false && hasWallet && (
            <Button stretch onClick={handleConfirmApprove} variant="fancy">
              {t('txManager.approve')}
            </Button>
          )}
          {((isApproved && type === FarmActionType.DEPOSIT) || type !== FarmActionType.DEPOSIT) && (
            <Button stretch onClick={handleConfirm} variant="fancy">
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
