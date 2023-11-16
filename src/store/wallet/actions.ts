import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AssetValue, WalletOption } from '@swapkit/core';
import { Chain } from '@swapkit/core';

import type { LedgerAccount } from '../../../ledgerLive/wallet/LedgerLive';

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const { getWalletByChain } = await (await import('services/swapKit')).getSwapKitClient();
    const data = await getWalletByChain(chain);

    return { chain, data };
  },
);

export const setLedgerLiveWalletByChain = createAsyncThunk(
  'ledgerLive/setLedgerLiveWalletByChain',
  async (data: {
    chain: Chain;
    wallet: {
      address: string;
      balance: AssetValue[];
      walletType: WalletOption;
      ledgerLiveAccount: LedgerAccount;
      walletMethods: any;
    };
  }) => {
    return { chain: data.chain, wallet: data.wallet };
  },
);

export const updateLedgerLiveBalance = createAsyncThunk(
  'ledgerLive/updateLedgerLiveBalance',
  async (chain: Chain, { getState }) => {
    const state: any = getState();
    const { getBalance } = state.wallet.wallet[chain]?.walletMethods;
    const balance = (await getBalance(state.wallet.wallet[chain]?.address)) as AssetValue[];

    if (chain !== Chain.Ethereum) await new Promise((res) => setTimeout(res, 200));
    return { chain, balance };
  },
);
