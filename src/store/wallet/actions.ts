import { createAsyncThunk } from '@reduxjs/toolkit';
import { Chain } from '@thorswap-lib/types';

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const { getWalletByChain } = await (await import('services/swapKit')).getSwapKitClient();

    const data = await getWalletByChain(chain);

    return { chain, data };
  },
);
