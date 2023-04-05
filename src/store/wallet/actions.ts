import { createAsyncThunk } from '@reduxjs/toolkit';
import { Chain } from '@thorswap-lib/types';
import { getGeckoData } from 'services/coingecko';

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const { getWalletByChain } = await (await import('services/swapKit')).getSwapKitClient();

    const data = await getWalletByChain(chain);

    return { chain, data };
  },
);

export const getCoingeckoData = createAsyncThunk('coingecko/coinInfo', (symbols: string[]) =>
  getGeckoData(symbols),
);
