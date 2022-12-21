import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Wallet } from '@thorswap-lib/multichain-core';
import { Chain, Keystore } from '@thorswap-lib/types';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { GeckoData } from 'store/wallet/types';

import * as walletActions from './actions';

const initialWallet = {
  [Chain.Bitcoin]: null,
  [Chain.Binance]: null,
  [Chain.THORChain]: null,
  [Chain.Ethereum]: null,
  [Chain.Avalanche]: null,
  [Chain.Litecoin]: null,
  [Chain.BitcoinCash]: null,
  [Chain.Doge]: null,
  [Chain.Cosmos]: null,
};

const initialState = {
  isConnectModalOpen: false,
  keystore: null as Keystore | null,
  wallet: initialWallet as Wallet | null,
  walletLoading: false,
  chainWalletLoading: initialWallet as Record<Chain, boolean | null>,
  geckoData: {} as Record<string, GeckoData>,
  geckoDataLoading: {} as Record<string, boolean>,
  isVthorApproved: false,
  isVthorApprovedLoading: false,
  hiddenAssets: (getFromStorage('hiddenAssets') || {}) as Record<Chain, string[]>,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnect: (state) => {
      saveInStorage({ key: 'previousWallet', value: null });
      saveInStorage({ key: 'restorePreviousWallet', value: false });
      state.keystore = null;
      state.wallet = initialWallet as Wallet;
      state.walletLoading = false;
    },
    addAssetToHidden: (
      state,
      { payload: { address, chain } }: PayloadAction<{ chain: Chain; address: string }>,
    ) => {
      const assets = [...(state.hiddenAssets[chain] || []), address];
      state.hiddenAssets[chain] = assets;
      saveInStorage({ key: 'hiddenAssets', value: state.hiddenAssets });
    },
    clearChainHiddenAssets: (state, { payload }: PayloadAction<Chain>) => {
      state.hiddenAssets[payload] = [];
      saveInStorage({ key: 'hiddenAssets', value: state.hiddenAssets });
    },
    disconnectByChain: (state, action: PayloadAction<Chain>) => {
      saveInStorage({ key: 'previousWallet', value: null });
      saveInStorage({ key: 'restorePreviousWallet', value: false });
      if (state.wallet) state.wallet[action.payload] = null;
    },
    connectKeystore: (state, action: PayloadAction<Keystore>) => {
      state.keystore = action.payload;
    },
    setIsConnectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConnectModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.getWalletByChain.pending, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: true,
        };
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, { payload: { chain, data } }) => {
        if (state.wallet && chain in state.wallet) {
          state.wallet = {
            ...state.wallet,
            [chain]: data,
          };
        }

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: false,
        };
      })
      .addCase(walletActions.getWalletByChain.rejected, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: false,
        };
      })
      .addCase(
        walletActions.getCoingeckoData.pending,
        (state, { meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => {
            state.geckoDataLoading[symbol] = true;
          });
        },
      )
      .addCase(
        walletActions.getCoingeckoData.fulfilled,
        (state, { payload: { data: geckoInfo }, meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => {
            state.geckoDataLoading[symbol] = false;
          });

          geckoInfo.forEach(({ symbol, geckoData }) => {
            state.geckoData[symbol] = geckoData;
          });
        },
      )
      .addCase(
        walletActions.getCoingeckoData.rejected,
        (state, { meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => {
            state.geckoDataLoading[symbol] = true;
          });
        },
      )
      .addCase(
        walletActions.getIsVthorApproved.pending,
        (state, payload: { payload: boolean | undefined }) => {
          state.isVthorApproved = payload.payload ? payload.payload : false;
          state.isVthorApprovedLoading = true;
        },
      )
      .addCase(
        walletActions.getIsVthorApproved.fulfilled,
        (state, payload: { payload: boolean | undefined }) => {
          state.isVthorApproved = payload.payload ? payload.payload : false;
          state.isVthorApprovedLoading = false;
        },
      )
      .addCase(walletActions.getIsVthorApproved.rejected, (state) => {
        state.isVthorApproved = false;
        state.isVthorApprovedLoading = false;
      });
  },
});

export const { actions } = walletSlice;

export default walletSlice.reducer;
