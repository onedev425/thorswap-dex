import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

type Params = {
  inputAsset: AssetEntity;
  contract?: string;
};

export const useSwapApprove = ({ inputAsset, contract }: Params) => {
  const appDispatch = useAppDispatch();
  const { wallet } = useWallet();

  const handleApprove = useCallback(async () => {
    const from = wallet?.[inputAsset.L1Chain as Chain]?.address;
    if (from) {
      const id = v4();
      const inChain = inputAsset.L1Chain;
      const type =
        inChain === Chain.Ethereum ? TransactionType.ETH_APPROVAL : TransactionType.AVAX_APPROVAL;

      appDispatch(
        addTransaction({
          id,
          from,
          inChain,
          type,
          label: `${t('txManager.approve')} ${inputAsset.name}`,
        }),
      );

      const { approveAssetForContract, approveAsset } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      try {
        const txid = await (contract
          ? approveAssetForContract(inputAsset, contract)
          : approveAsset(inputAsset));

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [wallet, inputAsset, appDispatch, contract]);

  return handleApprove;
};
