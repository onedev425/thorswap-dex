import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getFromStorage, saveInStorage } from 'helpers/storage';

import * as multisigActions from './actions';
import type { MultisigWallet, State } from './types';

const EMPTY_STATE = {
  address: '',
  name: '',
  members: [],
  threshold: 2,
  balances: [],
  loadingBalances: false,
};

const initialState: State =
  {
    ...(getFromStorage('multisigWallet') as MultisigWallet),
    balances: [],
    loadingBalances: false,
  } || EMPTY_STATE;

const multisigSlice = createSlice({
  name: 'multisig',
  initialState,
  reducers: {
    addMultisigWallet(_, { payload }: PayloadAction<MultisigWallet>) {
      saveInStorage({ key: 'multisigWallet', value: payload });

      return { ...payload, balances: [], loadingBalances: false };
    },
    clearMultisigWallet() {
      saveInStorage({ key: 'multisigWallet', value: EMPTY_STATE });
      return EMPTY_STATE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(multisigActions.loadMultisigBalances.pending, (state) => {
        state.loadingBalances = true;
      })
      .addCase(multisigActions.loadMultisigBalances.rejected, (state) => {
        state.loadingBalances = false;
      })
      .addCase(multisigActions.loadMultisigBalances.fulfilled, (state, { payload }) => {
        state.balances = payload;
        state.loadingBalances = false;
      });
  },
});

export const { actions } = multisigSlice;

export default multisigSlice.reducer;
