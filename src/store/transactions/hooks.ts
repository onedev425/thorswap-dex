import { useMemo } from 'react';
import { useAppSelector } from 'store/store';
import {
  CompletedTransactionType,
  PendingTransactionType,
  TransactionType,
} from 'store/transactions/types';
import { isTxCompleted, isTxPending } from 'store/transactions/utils';

export const useTransactionsState = () => {
  const transactions = useAppSelector((state) => state.transactions);
  const sortedTransactions = useMemo(
    () =>
      transactions
        .concat()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [transactions],
  );

  const [pending, completed] = useMemo(
    () =>
      sortedTransactions.reduce(
        (acc, tx) => {
          if (isTxPending(tx)) {
            acc[0].push(tx as PendingTransactionType);
          } else if (isTxCompleted(tx)) {
            acc[1].push(tx);
          }
          return acc;
        },
        [[] as PendingTransactionType[], [] as CompletedTransactionType[]],
      ),
    [sortedTransactions],
  );

  const advancedTracking = useMemo(
    () => sortedTransactions.filter((t) => (t.txid && t.route && t.quoteId) || t.details),
    [sortedTransactions],
  );

  const numberOfPendingApprovals = useMemo(
    () =>
      pending.filter(({ type }) =>
        [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
      ).length,
    [pending],
  );

  return {
    transactions: sortedTransactions,
    pending,
    completed,
    numberOfPendingApprovals,
    advancedTracking,
  };
};
