import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type {
  PendingTransactionType,
  TrackedTransactionType,
  TransactionStatus,
} from 'store/transactions/types'

const initialState = {
  pending: [] as PendingTransactionType[],
  completed: [] as TrackedTransactionType[],
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(
      state,
      { payload }: PayloadAction<Omit<PendingTransactionType, 'timestamp'>>,
    ) {
      state.pending.push({ ...payload, timestamp: new Date() })
    },
    updateTransaction(
      state,
      { payload }: PayloadAction<Partial<PendingTransactionType>>,
    ) {
      const index = state.pending.findIndex(({ id }) => id === payload.id)

      if (index !== -1) {
        state.pending[index] = { ...state.pending[index], ...payload }
      }
    },
    removeTransaction(state, { payload }: PayloadAction<string>) {
      state.pending = state.pending.filter(({ txid }) => txid !== payload)
    },
    completeTransaction(
      state,
      {
        payload: { id, status },
      }: PayloadAction<{ id: string; status: TransactionStatus }>,
    ) {
      state.pending = state.pending.filter((item) => {
        const isPending = [item.txid, item.id].includes(id)

        if (isPending) {
          state.completed.push({ ...item, status, timestamp: new Date() })
        }

        return !isPending
      })
    },
    clearTransactions() {
      return initialState
    },
  },
})

export const {
  addTransaction,
  clearTransactions,
  completeTransaction,
  removeTransaction,
  updateTransaction,
} = transactionsSlice.actions

export default transactionsSlice.reducer
