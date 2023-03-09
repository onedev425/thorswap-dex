import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest } from '@thorswap-lib/helpers';
import { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { Chain } from '@thorswap-lib/types';
import dayjs from 'dayjs';
import { midgardApi } from 'services/midgard';
import { midgardAPIUrl, THORNODE_URL } from 'settings/config';

import { LiquidityProvider, SaverProvider, ThornodePoolType } from './types';

export const getThornameExpireDate = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string;
  lastThorchainBlock: number;
}) => {
  const blocksPerYear = 5_256_000;
  const blocksDiff = lastThorchainBlock - parseInt(expire);
  const days = (blocksDiff / blocksPerYear) * -365;

  return dayjs().add(days, 'days').format('YYYY-MM-DD');
};

export const getNetworkData = createAsyncThunk('midgard/getNetworkData', midgardApi.getNetworkData);
export const getLastblock = createAsyncThunk('midgard/getLastblock', midgardApi.getLastblock);
export const getStats = createAsyncThunk('midgard/getStats', midgardApi.getStats);
export const getQueue = createAsyncThunk('midgard/getQueue', midgardApi.getQueue);
export const getTVLHistory = createAsyncThunk('midgard/getTVLHistory', midgardApi.getTVLHistory);
export const getSwapHistory = createAsyncThunk('midgard/getSwapHistory', midgardApi.getSwapHistory);

export const getPools = createAsyncThunk('midgard/getPools', (period?: PoolPeriods) =>
  midgardApi.getPools(undefined, period),
);

export const getLiquidityHistory = createAsyncThunk(
  'midgard/getLiquidityHistory',
  midgardApi.getLiquidityHistory,
);

export const getEarningsHistory = createAsyncThunk(
  'midgard/getEarningsHistory',
  midgardApi.getEarningsHistory,
);

export const getMimir = createAsyncThunk('thorchain/getThorchainMimir', () =>
  getRequest<any>(midgardAPIUrl('thorchain/mimir')),
);

export const getNodes = createAsyncThunk('midgard/getNodes', midgardApi.getNodes);

export const getPoolMemberDetailByChain = createAsyncThunk(
  'midgard/getPoolMemberDetailByChain',
  async ({ address }: { chain: Chain; address: string }) => {
    const response = await midgardApi.getMemberDetail(address);

    return response;
  },
);

export const getFullMemberDetail = createAsyncThunk(
  'midgard/getFullMemberDetail',
  async (addresses: string[]) => {
    const response = await midgardApi.getFullMemberDetail(addresses.join(','));
    return response;
  },
);

export const getLpDetails = createAsyncThunk(
  'midgard/getLpDetails',
  async ({ address, pool }: { address: string; pool: string }) => {
    const response = await midgardApi.getLpDetails(address, pool);
    return response;
  },
);
// get 24h volume
export const getVolume24h = createAsyncThunk('midgard/getVolume24h', async () => {
  const { intervals: swapIntervals } = await midgardApi.getSwapHistory({
    query: { interval: 'day', count: 2 },
  });

  const { intervals: liquidityIntervals } = await midgardApi.getLiquidityHistory({
    query: { interval: 'day', count: 2 },
  });

  // swap + add + withdraw
  const volume24h =
    Number(swapIntervals[0].totalVolume) +
    Number(liquidityIntervals[0].addLiquidityVolume) +
    Number(liquidityIntervals[0].withdrawVolume);

  return volume24h;
});

export const getThorchainInboundData = createAsyncThunk(
  'midgard/getInboundAddresses',
  midgardApi.getInboundAddresses,
);

export const reloadPoolMemberDetailByChain = createAsyncThunk(
  'midgard/reloadPoolMemberDetailByChain',
  async ({
    thorchainAddress,
    assetChainAddress,
  }: {
    chain: Chain;
    thorchainAddress: string;
    assetChainAddress: string;
  }) => {
    const runeMemberData = await midgardApi.getMemberDetail(thorchainAddress);
    const assetMemberData = await midgardApi.getMemberDetail(assetChainAddress);

    return { runeMemberData, assetMemberData };
  },
);

export const getLiquidityProviderData = createAsyncThunk(
  'thornode/getLiquidityProvider',
  ({ address, asset }: { asset: string; address: string }) =>
    getRequest<LiquidityProvider>(`${THORNODE_URL}/pool/${asset}/liquidity_provider/${address}`),
);

export const getSaverData = ({ asset, address }: { asset: string; address: string }) =>
  getRequest<SaverProvider>(`${THORNODE_URL}/pool/${asset}/saver/${address}`);

export const getSaverQuote = ({
  type,
  ...rest
}: {
  type: 'deposit' | 'withdraw';
  asset: string;
  amount?: string;
  address?: string;
  withdraw_bps?: string;
}) => getRequest(`${THORNODE_URL}/quote/saver/${type}?${new URLSearchParams(rest).toString()}`);

export const getSaverPools = () => getRequest<ThornodePoolType[]>(`${THORNODE_URL}/pools`);
