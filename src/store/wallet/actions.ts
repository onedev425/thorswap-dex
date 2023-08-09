import { createAsyncThunk } from '@reduxjs/toolkit';
import { Amount, AmountType, AssetAmount } from '@thorswap-lib/swapkit-core';
import { Balance, Chain, WalletOption } from '@thorswap-lib/types';

import { getAssetForBalance, LedgerAccount } from '../../../ledgerLive/wallet/LedgerLive';

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
    promise: Promise<{
      chain: Chain;
      wallet: {
        address: string;
        balance: AssetAmount[];
        walletType: WalletOption;
        ledgerLiveAccount: LedgerAccount;
        walletMethods: any;
      };
    }>;
  }) => {
    return { chain: data.chain, wallet: (await data.promise).wallet };
  },
);

export const updateLedgerLiveBalance = createAsyncThunk(
  'ledgerLive/updateLedgerLiveBalance',
  async (chain: Chain, { getState }) => {
    const state: any = getState();
    const { getBalance } = state.wallet.wallet[chain]?.walletMethods;
    const balance = ((await getBalance(state.wallet.wallet[chain]?.address)) as Balance[]).map(
      ({ asset, amount }) =>
        new AssetAmount(
          getAssetForBalance(asset),
          new Amount(amount.amount().toString() || '0', AmountType.BASE_AMOUNT, amount.decimal),
        ),
    );
    if (chain !== Chain.Ethereum) await new Promise((res) => setTimeout(res, 200));
    return { chain: chain, balance: balance };
  },
);
