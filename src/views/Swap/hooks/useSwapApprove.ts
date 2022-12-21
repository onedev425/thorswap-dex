import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

type Params = {
  inputAsset: Asset;
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

      try {
        const txid = await (contract
          ? multichain().approveAssetForStaking(inputAsset, contract)
          : multichain().approveAsset(inputAsset));

        if (txid) {
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
