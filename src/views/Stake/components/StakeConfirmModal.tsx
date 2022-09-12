import { BigNumber } from '@ethersproject/bignumber';
import { Asset } from '@thorswap-lib/multichain-core';
import { Box, Button, Modal, Typography } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { Input } from 'components/Input';
import { PercentSelect } from 'components/PercentSelect/PercentSelect';
import { showErrorToast } from 'components/Toast';
import { useApproveContract } from 'hooks/useApproveContract';
import { useCallback, useEffect, useState } from 'react';
import { ContractType, fromWei, getContractAddress, toWei } from 'services/contract';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { FarmActionType } from 'views/Stake/types';

const actionNameKey: Record<FarmActionType, string> = {
  [FarmActionType.DEPOSIT]: 'views.staking.depositAction',
  [FarmActionType.CLAIM]: 'views.staking.harvestAction',
  [FarmActionType.WITHDRAW]: 'views.staking.withdrawAction',
  [FarmActionType.EXIT]: 'views.staking.exitAction',
};

type Props = {
  isOpened: boolean;
  type: FarmActionType;
  tokenBalance: BigNumber;
  stakedAmount: BigNumber;
  claimableAmount: BigNumber;
  lpAsset: Asset;
  contractType: ContractType;
  onConfirm: (tokenAmount: BigNumber) => void;
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
  const appDispatch = useAppDispatch();
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0));
  const { wallet } = useWallet();
  const { isApproved } = useApproveContract(lpAsset, getContractAddress(contractType), !!wallet);

  const actionLabel = t(actionNameKey[type]);
  const isClaim = type === FarmActionType.CLAIM;

  const handleChangeAmount = useCallback(
    (percent: number) => {
      if (type === FarmActionType.DEPOSIT) {
        setAmount(tokenBalance.mul(percent).div(100));
      } else if (type === FarmActionType.CLAIM) {
        setAmount(claimableAmount.mul(percent).div(100));
      } else if (type === FarmActionType.WITHDRAW) {
        setAmount(stakedAmount.mul(percent).div(100));
      }
    },
    [type, tokenBalance, claimableAmount, stakedAmount],
  );

  const onAmountUpdate = useCallback((val: string) => {
    // logic to update amount
    setAmount(toWei(BigNumber.from(val).toNumber()));
  }, []);

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
    if (wallet) {
      onCancel();
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: `${t('txManager.approve')} ${lpAsset.name}`,
          inChain: lpAsset.L1Chain,
          type: TransactionType.ETH_APPROVAL,
        }),
      );

      try {
        const txid = await multichain().approveAssetForStaking(
          lpAsset,
          getContractAddress(contractType),
        );

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
        console.info(error);
      }
    }
  }, [wallet, onCancel, lpAsset, appDispatch, contractType]);

  useEffect(() => {
    handleChangeAmount(100);
  }, [handleChangeAmount]);

  return (
    <Modal isOpened={isOpened} onClose={onCancel} title={actionLabel}>
      <Box col className="w-full md:w-atuo md:!min-w-[350px]" flex={1}>
        <InfoRow
          label={t('views.staking.tokenBalance')}
          value={fromWei(tokenBalance).toLocaleString() || 'N/A'}
        />
        <InfoRow
          label={t('views.staking.tokenStaked')}
          value={fromWei(stakedAmount).toString() || 'N/A'}
        />
        <InfoRow
          label={t('views.staking.claimable')}
          value={fromWei(claimableAmount).toFixed(2) || 'N/A'}
        />

        {!isClaim && (
          <>
            <Box alignCenter className="gap-3 !mt-8">
              <Typography>
                {t('views.staking.stakeActionAmount', {
                  stakeAction: actionLabel,
                })}
              </Typography>
              <Input
                border="rounded"
                className="text-right"
                onChange={(e) => onAmountUpdate(e.target.value)}
                value={fromWei(amount).toString()}
              />
            </Box>

            <Box className="!mt-4 flex-1">
              <PercentSelect onSelect={onPercentSelect} options={[25, 50, 75, 100]} />
            </Box>
          </>
        )}

        <Box className="gap-3 !mt-8">
          {type === FarmActionType.DEPOSIT && isApproved === false && wallet && (
            <Button isFancy stretch onClick={handleConfirmApprove} variant="primary">
              {t('txManager.approve')}
            </Button>
          )}
          {((isApproved && type === FarmActionType.DEPOSIT) || type !== FarmActionType.DEPOSIT) && (
            <Button isFancy stretch onClick={handleConfirm} variant="primary">
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
