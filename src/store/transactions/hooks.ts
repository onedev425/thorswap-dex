import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/store";
import { updateTransaction } from "store/transactions/slice";
import type { CompletedTransactionType, PendingTransactionType } from "store/transactions/types";
import { TransactionType } from "store/transactions/types";
import { isTxCompleted, isTxPending } from "store/transactions/utils";

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export const useTransactionsState = () => {
  const transactions = useAppSelector(({ transactions }) => transactions);
  const appDispatch = useAppDispatch();
  const isMounted = useIsMounted();
  const transactionsRef = useRef(transactions);

  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    if (!isMounted.current) return [];
    return [...transactionsRef.current].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [transactions, transactionsRef.current, isMounted]);

  const [pending, completed] = useMemo(() => {
    if (!isMounted.current) return [[], []];
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
  }, [sortedTransactions, transactionsRef.current, isMounted]);

  const advancedTracking = useMemo(() => {
    if (!isMounted.current) return [];
    return sortedTransactions.filter((t) => (t.txid && t.route && t.quoteId) || t.details);
  }, [sortedTransactions, transactionsRef.current, isMounted]);

  const numberOfPendingApprovals = useMemo(() => {
    if (!isMounted.current) return 0;
    return pending.filter(({ type }) =>
      [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
    ).length;
  }, [pending, transactionsRef.current, isMounted]);

  const updateOldTransactions = useCallback(() => {
    if (!isMounted.current) return;
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    for (const tx of pending) {
      if (new Date(tx.timestamp).getTime() < oneDayAgo) {
        appDispatch(updateTransaction({ id: tx.id, status: "unknown", completed: true }));
      }
    }
  }, [appDispatch, pending, transactionsRef.current, isMounted]);

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
