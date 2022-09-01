import { Amount, Asset, AssetAmount } from '@thorswap-lib/multichain-sdk';
import { showErrorToast } from 'components/Toast';
import { translateErrorMsg } from 'helpers/error';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { v4 } from 'uuid';

type Params = {
  sendAsset: Asset;
  sendAmount: Amount;
  recipientAddress: string;
  memo: string;
  setIsOpenConfirmModal: (isOpen: boolean) => void;
};

export const useConfirmSend = ({
  sendAsset,
  sendAmount,
  recipientAddress: recipient,
  memo,
  setIsOpenConfirmModal,
}: Params) => {
  const appDispatch = useAppDispatch();

  const handleConfirmSend = useCallback(async () => {
    setIsOpenConfirmModal(false);

    if (sendAsset) {
      const assetAmount = new AssetAmount(sendAsset, sendAmount);

      const id = v4();
      const label = `${t('txManager.send')} ${sendAmount.toSignificant(6)} ${sendAsset.toString()}`;

      appDispatch(
        addTransaction({ id, from: recipient, inChain: sendAsset.L1Chain, type: 'send', label }),
      );

      try {
        const txid = await multichain().send({ assetAmount, recipient, memo });

        if (txid) {
          updateTransaction({ id, txid });
        }
      } catch (error: NotWorth) {
        const description = translateErrorMsg(error?.toString());
        console.info('confirmSendError', { error, description });
        appDispatch(completeTransaction({ id, status: 'error' }));

        showErrorToast(t('notification.sendTxFailed'), description);
      }
    }
  }, [setIsOpenConfirmModal, sendAsset, sendAmount, appDispatch, recipient, memo]);

  return handleConfirmSend;
};
