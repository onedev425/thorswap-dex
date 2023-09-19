import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AssetAmount, Wallet } from '@thorswap-lib/swapkit-core';
import type { Keystore } from '@thorswap-lib/types';
import { Chain } from '@thorswap-lib/types';
import { getFromStorage, saveInStorage } from 'helpers/storage';

import * as walletActions from './actions';

const initialWallet = {
  [Chain.Bitcoin]: null,
  [Chain.Binance]: null,
  [Chain.THORChain]: null,
  [Chain.Ethereum]: null,
  [Chain.Avalanche]: null,
  [Chain.Litecoin]: null,
  [Chain.BitcoinCash]: null,
  [Chain.Dogecoin]: null,
  [Chain.Cosmos]: null,
};

type LedgerLiveWallet = Wallet & {
  walletMethods?: any;
};

const initialState = {
  phrase: '',
  pubKey: '',
  isConnectModalOpen: false,
  keystore: null as Keystore | null,
  wallet: initialWallet as Wallet | LedgerLiveWallet,
  oldBalance: initialWallet as Record<Chain, AssetAmount[] | null>,
  walletLoading: false,
  chainWalletLoading: initialWallet as Record<Chain, boolean | null>,
  hiddenAssets: (getFromStorage('hiddenAssets') || {}) as Record<Chain, string[]>,
  hasVestingAlloc: false,
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
      state.hasVestingAlloc = false;
    },
    // updateMaxSendableBalanceForAddress: (
    //   state,
    //   { payload: { address, chain } }: PayloadAction<{ chain: Chain; address: string }>,
    // ) => {},
    addAssetToHidden: (
      state,
      { payload: { address, chain } }: PayloadAction<{ chain: Chain; address: string }>,
    ) => {
      state.hiddenAssets[chain] = [...new Set([...(state.hiddenAssets[chain] || []), address])];

      if (state.wallet?.[chain]?.balance) {
        // @ts-expect-error
        state.wallet[chain].balance = state.wallet[chain]?.balance.filter(
          ({ asset }) => asset.toString() !== address,
        );
      }

      saveInStorage({ key: 'hiddenAssets', value: state.hiddenAssets });
    },
    clearChainHiddenAssets: (state, { payload }: PayloadAction<Chain>) => {
      state.hiddenAssets[payload] = [];
      if (state.wallet?.[payload]?.balance) {
        // @ts-expect-error
        state.wallet[payload].balance = state.oldBalance[payload];
      }
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
        payload: { phrase, keystore, pubKey },
      }: PayloadAction<{ keystore: Keystore; phrase: string; pubKey: string }>,
    ) => {
      state.phrase = phrase;
      state.keystore = keystore;
      state.pubKey = pubKey;
    },
    setIsConnectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConnectModalOpen = action.payload;
    },
    setHasVestingAlloc: (state, action: PayloadAction<boolean>) => {
      state.hasVestingAlloc = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.getWalletByChain.pending, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading[chain] = true;
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, { payload: { chain, data } }) => {
        state.chainWalletLoading[chain] = false;
        if (!data?.address || !data?.balance) {
          state.wallet[chain] = null;
        } else if (data?.address && data?.balance && data?.walletType) {
          state.oldBalance[chain] = data.balance;
          const balance = data.balance.filter(
            ({ asset }) =>
              !state.hiddenAssets[chain]?.includes(asset.toString()) &&
              !(!asset.symbol || [' ', '/'].some((c) => asset.symbol.includes(c))),
          );

          state.wallet[chain] = {
            walletType: data.walletType,
            address: data.address,
            balance,
          };
        }
      })
      .addCase(walletActions.getWalletByChain.rejected, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading[chain] = false;
      })
      .addCase(
        walletActions.setLedgerLiveWalletByChain.pending,
        (
          state,
          {
            meta: {
              arg: { chain },
            },
          },
        ) => {
          state.chainWalletLoading[chain] = true;
        },
      )
      .addCase(
        walletActions.setLedgerLiveWalletByChain.fulfilled,
        (state, { payload: { chain, wallet } }) => {
          state.chainWalletLoading[chain] = false;
          if (!wallet?.address || !wallet?.balance) {
            state.wallet[chain] = null;
          } else {
            state.oldBalance[chain] = wallet.balance;
            const balance =
              wallet?.balance?.filter(
                ({ asset }) =>
                  !state.hiddenAssets[chain]?.includes(asset.toString()) &&
                  /**
                   * Filter out assets with invalid symbols or scam tokens with symbols like ' ', '/', '.'
                   */
                  !(!asset.symbol || [' ', '/', '.'].some((c) => asset.symbol.includes(c))),
              ) || null;

            state.wallet[chain] = { ...wallet, balance };
          }
        },
      )
      .addCase(
        walletActions.setLedgerLiveWalletByChain.rejected,
        (
          state,
          {
            meta: {
              arg: { chain },
            },
          },
        ) => {
          state.chainWalletLoading[chain] = false;
        },
      )
      .addCase(walletActions.updateLedgerLiveBalance.pending, (state, { meta: { arg: chain } }) => {
        state.chainWalletLoading[chain] = true;
      })
      .addCase(
        walletActions.updateLedgerLiveBalance.fulfilled,
        (state, { payload: { chain, balance } }) => {
          state.chainWalletLoading[chain] = false;
          state.oldBalance[chain] = balance;

          //@ts-expect-error
          state.wallet[chain] = {
            ...state.wallet[chain],
            balance:
              balance?.filter(
                ({ asset }) =>
                  !state.hiddenAssets[chain]?.includes(asset.toString()) &&
                  /**
                   * Filter out assets with invalid symbols or scam tokens with symbols like ' ', '/', '.'
                   */
                  !(!asset.symbol || [' ', '/', '.'].some((c) => asset.symbol.includes(c))),
              ) || null,
          };
        },
      )
      .addCase(
        walletActions.updateLedgerLiveBalance.rejected,
        (state, { meta: { arg: chain } }) => {
          state.chainWalletLoading[chain] = false;
        },
      );
  },
});

export const { actions } = walletSlice;

export default walletSlice.reducer;
