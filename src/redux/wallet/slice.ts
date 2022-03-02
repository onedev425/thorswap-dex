import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  TERRAChain,
} from '@thorswap-lib/xchain-util'

import * as walletActions from './actions'
import { State } from './types'

const initialWallet = {
  [BTCChain]: null,
  [BNBChain]: null,
  [THORChain]: null,
  [ETHChain]: null,
  [LTCChain]: null,
  [BCHChain]: null,
  [DOGEChain]: null,
  [TERRAChain]: null,
}

const initialState: State = {
  isConnectModalOpen: false,
  keystore: null,
  wallet: initialWallet,
  walletLoading: false,
  chainWalletLoading: {
    [BTCChain]: false,
    [BNBChain]: false,
    [THORChain]: false,
    [ETHChain]: false,
    [LTCChain]: false,
    [BCHChain]: false,
    [DOGEChain]: false,
    [TERRAChain]: false,
  },
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnect(state) {
      state.keystore = null
      state.wallet = initialWallet
      state.walletLoading = false
    },
    disconnectByChain(state, action: PayloadAction<SupportedChain>) {
      if (state.wallet) state.wallet[action.payload] = null
    },
    connectKeystore(state, action: PayloadAction<Keystore>) {
      state.keystore = action.payload
    },
    setIsConnectModalOpen(state, action: PayloadAction<boolean>) {
      state.isConnectModalOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.loadAllWallets.pending, (state) => {
        state.walletLoading = true
      })
      .addCase(walletActions.loadAllWallets.fulfilled, (state, action) => {
        state.wallet = action.payload
        state.walletLoading = false
      })
      .addCase(walletActions.loadAllWallets.rejected, (state) => {
        state.walletLoading = false
      })
      .addCase(walletActions.getWalletByChain.pending, (state, action) => {
        const { arg: chain } = action.meta

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: true,
        }
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, action) => {
        const { chain, data } = action.payload
        if (state.wallet && chain in state.wallet) {
          state.wallet = {
            ...state.wallet,
            [chain]: data,
          }
        }

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: false,
        }
      })
      .addCase(walletActions.getWalletByChain.rejected, (state, action) => {
        const { arg: chain } = action.meta

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: false,
        }
      })
  },
})

export const { reducer, actions } = slice
export default slice
