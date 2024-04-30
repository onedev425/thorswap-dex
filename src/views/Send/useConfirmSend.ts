import type { AssetValue } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

type Params = {
  sendAsset: AssetValue;
  recipientAddress: string;
  memo: string;
  setIsOpenConfirmModal: (isOpen: boolean) => void;
  from?: string;
  customTxEnabled?: boolean;
};

export const useConfirmSend = ({
  sendAsset,
  recipientAddress: recipient,
  memo,
  setIsOpenConfirmModal,
  from,
  customTxEnabled = false,
}: Params) => {
  const appDispatch = useAppDispatch();

  const handleConfirmSend = useCallback(async () => {
    setIsOpenConfirmModal(false);
    if (sendAsset && (customTxEnabled || sendAsset.getValue('bigint') > 0)) {
      const id = v4();
      const label = `${t('txManager.send')} ${sendAsset.toSignificant(6)} ${
        sendAsset.isSynthetic ? 'Synth ' : ''
      }${sendAsset.ticker}`;

      appDispatch(
        addTransaction({
          id,
          from: recipient,
          inChain: sendAsset.chain,
          type: customTxEnabled ? TransactionType.TC_DEPOSIT : TransactionType.TC_SEND,
          label,
        }),
      );
      const { thorchain, getWallet } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        if (!thorchain) {
          throw new Error('THORChain Provider not found');
        }

        const txid = customTxEnabled
          ? await thorchain.deposit({
              assetValue: sendAsset,
              recipient,
              memo,
              from,
            })
          : ((await getWallet(sendAsset.chain)?.transfer({
              assetValue: sendAsset,
              recipient,
              memo,
              from,
            })) as string);

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error: NotWorth) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(
          t('notification.sendTxFailed'),
          error?.toString(),
          undefined,
          error as Error,
        );
      }
    }
  }, [setIsOpenConfirmModal, sendAsset, appDispatch, recipient, memo, from, customTxEnabled]);

  return handleConfirmSend;
};
