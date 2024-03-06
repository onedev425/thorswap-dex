import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/store';
import { updateTransaction } from 'store/transactions/slice';
import type { CompletedTransactionType, PendingTransactionType } from 'store/transactions/types';
import { TransactionType } from 'store/transactions/types';
import { isTxCompleted, isTxPending } from 'store/transactions/utils';

export const useTransactionsState = (skipV2Tracker = false) => {
  const transactions = useAppSelector(({ transactions }) => transactions);
  const appDispatch = useAppDispatch();

  const sortedTransactions = useMemo(() => {
    const txs = transactions
      .concat()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (skipV2Tracker) {
      // temp hack for v2 tracker
      // skip for chainflip
      return txs.filter((tx) => {
        const isChainflip = tx?.details?.meta || tx?.route?.providers.includes('CHAINFLIP');
        return !isChainflip;
      });
    }

    return txs;
  }, [skipV2Tracker, transactions]);

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

  useEffect(() => {
    // timestamp older than 24h - complete and do not process anymore
    pending.forEach((tx) => {
      if (new Date(tx.timestamp).getTime() < new Date(Date.now() - 86400000).getTime()) {
        appDispatch(updateTransaction({ id: tx.id, status: 'unknown', completed: true }));
      }
    });
  }, [appDispatch, pending]);

  return {
    transactions: sortedTransactions,
    pending,
    completed,
    numberOfPendingApprovals,
    advancedTracking,
  };
};
