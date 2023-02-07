import { useMemo } from 'react';
import { useAppSelector } from 'store/store';
import { TransactionType } from 'store/transactions/types';
import { isTxCompleted, isTxPending } from 'store/transactions/utils';

export const useTransactionsState = () => {
  const transactions = useAppSelector((state) => state.transactions);
  const pending = useMemo(() => transactions.filter(isTxPending), [transactions]).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const completed = useMemo(() => transactions.filter(isTxCompleted), [transactions]).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const numberOfPendingApprovals = pending.filter(({ type }) =>
    [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
  ).length;

  return { transactions, pending, completed, numberOfPendingApprovals };
};
