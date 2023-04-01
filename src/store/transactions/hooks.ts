import { useMemo } from 'react';
import { useAppSelector } from 'store/store';
import { TransactionType } from 'store/transactions/types';
import { isTxCompleted, isTxPending } from 'store/transactions/utils';

export const useTransactionsState = () => {
  const transactions = useAppSelector((state) => state.transactions);
  const sortedTransactions = useMemo(() => {
    const txs = [...transactions];
    txs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return txs;
  }, [transactions]);

  const pending = useMemo(() => sortedTransactions.filter(isTxPending), [sortedTransactions]);
  const completed = useMemo(() => sortedTransactions.filter(isTxCompleted), [sortedTransactions]);
  const advancedTracking = useMemo(
    () => sortedTransactions.filter((t) => (t.txid && t.route && t.quoteId) || t.details),
    [sortedTransactions],
  );

  const numberOfPendingApprovals = pending.filter(({ type }) =>
    [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
  ).length;

  return {
    transactions: sortedTransactions,
    pending,
    completed,
    numberOfPendingApprovals,
    advancedTracking,
  };
};
