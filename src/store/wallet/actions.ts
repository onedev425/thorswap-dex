import { createAsyncThunk } from '@reduxjs/toolkit';
import { Chain } from '@thorswap-lib/types';
import { getV2Address, VestingType } from 'helpers/assets';
import { getGeckoData } from 'services/coingecko';
import { multichain } from 'services/multichain';

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const data = await multichain().getWalletByChain(chain);

    return { chain, data };
  },
);

export const getCoingeckoData = createAsyncThunk('coingecko/coinInfo', async (symbols: string[]) =>
  getGeckoData(symbols),
);

export const getIsVthorApproved = createAsyncThunk('vthor/getApproval', async () => {
  const ethClient = multichain().eth.getClient();
  return ethClient
    .isApproved({
      contractAddress: getV2Address(VestingType.THOR),
      spenderAddress: getV2Address(VestingType.VTHOR),
    })
    .catch(() => false);
});
