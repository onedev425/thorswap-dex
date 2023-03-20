import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '@thorswap-lib/swapkit-core';
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
  phrase: '',
  privateKey: undefined as any,
  publicKey: undefined as any,
  isConnectModalOpen: false,
  keystore: null as Keystore | null,
  wallet: initialWallet as Wallet | null,
  walletLoading: false,
  chainWalletLoading: initialWallet as Record<Chain, boolean | null>,
  geckoData: {} as Record<string, GeckoData>,
  geckoDataLoading: {} as Record<string, boolean>,
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
      state.hiddenAssets[chain] = [...(state.hiddenAssets[chain] || []), address];
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
    connectKeystore: (
      state,
      {
        payload: { phrase, keystore, privateKey, publicKey },
      }: PayloadAction<{ keystore: Keystore; phrase: string; privateKey?: any; publicKey?: any }>,
    ) => {
      state.phrase = phrase;
      state.keystore = keystore;
      state.privateKey = privateKey;
      state.publicKey = publicKey;
    },
    setIsConnectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConnectModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.getWalletByChain.pending, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading[chain] = true;
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, { payload: { chain, data } }) => {
        state.chainWalletLoading[chain] = false;
        if (state.wallet && chain in state.wallet) {
          const balance = data?.balance.filter(
            ({ asset }) =>
              !state.hiddenAssets[chain]?.includes(asset.toString()) &&
              /**
               * Filter out assets with invalid symbols or scam tokens with symbols like ' ', '/', '.'
               */
              !(!asset.symbol || [' ', '/', '.'].some((c) => asset.symbol.includes(c))),
          );

          // @ts-expect-error
          state.wallet[chain] = { ...data, balance };
        }
      })
      .addCase(walletActions.getWalletByChain.rejected, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading[chain] = false;
      })
      .addCase(
        walletActions.getCoingeckoData.pending,
        (state, { meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => (state.geckoDataLoading[symbol] = true));
        },
      )
      .addCase(
        walletActions.getCoingeckoData.fulfilled,
        (state, { payload: { data: geckoInfo }, meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => (state.geckoDataLoading[symbol] = false));

          geckoInfo.forEach(({ symbol, geckoData }) => (state.geckoData[symbol] = geckoData));
        },
      )
      .addCase(
        walletActions.getCoingeckoData.rejected,
        (state, { meta: { arg: pendingSymbols } }) => {
          pendingSymbols.forEach((symbol) => (state.geckoDataLoading[symbol] = true));
        },
      );
  },
});

export const { actions } = walletSlice;

export default walletSlice.reducer;
