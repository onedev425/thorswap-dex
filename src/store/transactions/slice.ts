import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { TxnResult } from 'store/thorswap/types';
import { filterInitialTransactions, findTxIndexById } from 'store/transactions/utils';

import type {
  PendingTransactionType,
  TransactionsState,
  TransactionStatus,
  TxTrackerDetails,
} from './types';

const initialState = filterInitialTransactions(getFromStorage('txHistory') as TransactionsState);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, { payload }: PayloadAction<Omit<PendingTransactionType, 'timestamp'>>) {
      state.push({ ...payload, timestamp: new Date() });
      saveInStorage({ key: 'txHistory', value: state });
    },
    updateTransaction(state, { payload }: PayloadAction<Partial<PendingTransactionType>>) {
      const index = findTxIndexById(state, payload.id);

      if (index !== -1) {
        state[index] = { ...state[index], ...payload };
      }
      saveInStorage({ key: 'txHistory', value: state });
    },
    removeTransaction(state, { payload }: PayloadAction<string>) {
      // update this
      const filtered = state.filter(({ txid }) => txid !== payload);
      saveInStorage({ key: 'txHistory', value: filtered });

      return filtered;
    },
    completeTransaction(
      state,
      {
        payload,
      }: PayloadAction<{
        result?: string | TxnResult;
        id: string;
        status: TransactionStatus;
        details?: TxTrackerDetails;
      }>,
    ) {
      const index = findTxIndexById(state, payload.id);

      if (index !== -1) {
        state[index] = { ...state[index], ...payload, timestamp: new Date(), completed: true };
      }
      saveInStorage({ key: 'txHistory', value: state });
    },
    clearTransactions(state) {
      const filtered = state.filter(({ completed }) => !completed);
      saveInStorage({ key: 'txHistory', value: filtered });

      return filtered;
    },
  },
});

export const {
  addTransaction,
  clearTransactions,
  completeTransaction,
  removeTransaction,
  updateTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
