import {
  CompletedTransactionType,
  PendingTransactionType,
  TransactionsState,
} from 'store/transactions/types';

export const findTxById = (txs: TransactionsState, txId?: string) => {
  if (!txs.length || !txId) return null;
  return txs.find(({ txid, id, hash }) => [id, txid, hash].includes(txId)) || null;
};

export const findTxIndexById = (txs: TransactionsState, txId?: string) => {
  if (!txs.length || !txId) return -1;
  return txs.findIndex(({ txid, id, hash }) => [id, txid, hash].includes(txId));
};

export const isTxCompleted = (
  tx: PendingTransactionType | CompletedTransactionType,
): tx is CompletedTransactionType => {
  return !!tx.completed;
};

export const isTxPending = (
  tx: PendingTransactionType | CompletedTransactionType,
): tx is PendingTransactionType => {
  return !tx.completed;
};

export const filterInitialTransactions = (txs: TransactionsState) => {
  if (!txs?.length) return [];
  return txs.filter((tx) => tx.completed || tx.txid);
};
