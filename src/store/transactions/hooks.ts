import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/store";
import { updateTransaction } from "store/transactions/slice";
import type { CompletedTransactionType, PendingTransactionType } from "store/transactions/types";
import { TransactionType } from "store/transactions/types";
import { isTxCompleted, isTxPending } from "store/transactions/utils";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  return isMounted;
};

export const useTransactionsState = () => {
  const transactions = useAppSelector(({ transactions }) => transactions || []);
  const appDispatch = useAppDispatch();
  const isMounted = useIsMounted();

  const sortedTransactions = useMemo(() => {
    if (!isMounted) return [];
    return [...transactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [isMounted, transactions]);

  const [pending, completed] = useMemo(() => {
    if (!isMounted) return [[], []];
    return sortedTransactions.reduce(
      (acc, tx) => {
        if (isTxPending(tx)) {
          acc[0].push(tx as PendingTransactionType);
        } else if (isTxCompleted(tx)) {
          acc[1].push(tx);
        }
        return acc;
      },
      [[] as PendingTransactionType[], [] as CompletedTransactionType[]],
    );
  }, [sortedTransactions, isMounted]);

  const advancedTracking = useMemo(() => {
    if (!isMounted) return [];
    return sortedTransactions.filter((t) => (t.txid && t.route && t.quoteId) || t.details);
  }, [sortedTransactions, isMounted]);

  const numberOfPendingApprovals = useMemo(() => {
    if (!isMounted) return 0;
    return pending.filter(({ type }) =>
      [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
    ).length;
  }, [pending, isMounted]);

  const updateOldTransactions = useCallback(() => {
    if (!isMounted) return;
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    for (const tx of pending) {
      if (new Date(tx.timestamp).getTime() < oneDayAgo) {
        appDispatch(updateTransaction({ id: tx.id, status: "unknown", completed: true }));
      }
    }
  }, [appDispatch, pending, isMounted]);

  useEffect(() => {
    updateOldTransactions();
    const intervalId = setInterval(updateOldTransactions, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [updateOldTransactions]);

  return {
    transactions: sortedTransactions,
    pending,
    completed,
    numberOfPendingApprovals,
    advancedTracking,
  };
};
