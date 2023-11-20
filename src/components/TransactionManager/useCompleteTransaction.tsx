import type { TxTrackerDetails } from '@swapkit/api';
import { useWalletBalance } from 'context/wallet/hooks';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/store';
import type { TxnResult } from 'store/thorswap/types';
import { completeTransaction } from 'store/transactions/slice';
import type { PendingTransactionType, TransactionStatus } from 'store/transactions/types';

export const useCompleteTransaction = (tx: PendingTransactionType | null) => {
  const appDispatch = useAppDispatch();
  const { reloadAllWallets } = useWalletBalance();
  const { inChain, outChain } = tx || {};

  const refreshTxWallets = useCallback(() => {
    reloadAllWallets([inChain, outChain]);
  }, [inChain, outChain, reloadAllWallets]);

  const onCompleteTransaction = useCallback(
    ({
      result,
      status,
      details,
    }: {
      status: TransactionStatus;
      result?: string | TxnResult;
      details?: TxTrackerDetails;
    }) => {
      if (tx?.id) {
        appDispatch(completeTransaction({ id: tx.id, status, result, details }));
      }

      refreshTxWallets();
    },
    [appDispatch, refreshTxWallets, tx?.id],
  );

  return { onCompleteTransaction };
};
