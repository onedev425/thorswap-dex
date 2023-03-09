import { createAsyncThunk } from '@reduxjs/toolkit';
import { Chain } from '@thorswap-lib/types';
import { getGeckoData } from 'services/coingecko';

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const { getWalletByChain } = await (await import('services/multichain')).getSwapKitClient();

    return { chain, data: await getWalletByChain(chain) };
  },
);

export const getCoingeckoData = createAsyncThunk('coingecko/coinInfo', (symbols: string[]) =>
  getGeckoData(symbols),
);
