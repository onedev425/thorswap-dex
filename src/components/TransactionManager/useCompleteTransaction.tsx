import type { TxTrackerDetails } from '@swapkit/api';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/store';
import type { TxnResult } from 'store/thorswap/types';
import { completeTransaction } from 'store/transactions/slice';
import type { PendingTransactionType, TransactionStatus } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';

export const useCompleteTransaction = (tx: PendingTransactionType | null) => {
  const appDispatch = useAppDispatch();
  const { wallet, refreshWalletByChain } = useWallet();
  const { inChain, outChain } = tx || {};

  const refreshTxWallets = useCallback(() => {
    if (inChain && wallet?.[inChain]) {
      refreshWalletByChain(inChain);
    }
    if (outChain && outChain && wallet?.[outChain]) {
      refreshWalletByChain(outChain);
    }
  }, [inChain, outChain, refreshWalletByChain, wallet]);

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
