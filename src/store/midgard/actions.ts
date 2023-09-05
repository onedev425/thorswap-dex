import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest } from '@thorswap-lib/helpers';
import type { InboundAddressesItem, PoolPeriods } from '@thorswap-lib/midgard-sdk';
import type { Chain } from '@thorswap-lib/types';
import dayjs from 'dayjs';
import { midgardSdk } from 'services/midgard';
import { THORNODE_URL } from 'settings/config';

import type { LiquidityProvider, SaverProvider, ThornodePoolType } from './types';

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

export const getNetworkData = createAsyncThunk('midgard/getNetworkData', midgardSdk.getNetworkData);
export const getLastblock = createAsyncThunk('midgard/getLastblock', () =>
  getRequest<any>(`${THORNODE_URL}/lastblock`),
);
export const getQueue = createAsyncThunk('midgard/getQueue', () =>
  getRequest<any>(`${THORNODE_URL}/queue`),
);
export const getTVLHistory = createAsyncThunk('midgard/getTVLHistory', midgardSdk.getTVLHistory);
export const getSwapHistory = createAsyncThunk('midgard/getSwapHistory', midgardSdk.getSwapHistory);

export const getPools = createAsyncThunk('midgard/getPools', (period?: PoolPeriods) =>
  midgardSdk.getPools(undefined, period),
);

export const getLiquidityHistory = createAsyncThunk(
  'midgard/getLiquidityHistory',
  midgardSdk.getLiquidityHistory,
);

export const getEarningsHistory = createAsyncThunk(
  'midgard/getEarningsHistory',
  midgardSdk.getEarningsHistory,
);

export const getMimir = createAsyncThunk('thorchain/getThorchainMimir', () =>
  getRequest<any>(`${THORNODE_URL}/mimir`),
);

export const getNodes = createAsyncThunk('midgard/getNodes', () =>
  getRequest<any>(`${THORNODE_URL}/nodes`),
);

export const getPoolMemberDetailByChain = createAsyncThunk(
  'midgard/getPoolMemberDetailByChain',
  async ({ address }: { chain: Chain; address: string }) => {
    const response = await midgardSdk.getMemberDetail(address);

    return response;
  },
);

export const getFullMemberDetail = createAsyncThunk(
  'midgard/getFullMemberDetail',
  async (addresses: string[]) => midgardSdk.getFullMemberDetail(addresses.join(',')),
);

export const getLpDetails = createAsyncThunk(
  'midgard/getLpDetails',
  async ({ address, pool }: { address: string; pool: string }) => {
    const response = await midgardSdk.getLpDetails(address, pool);
    return response;
  },
);
// get 24h volume
export const getVolume24h = createAsyncThunk('midgard/getVolume24h', async () => {
  const { meta: swapsMeta } = await midgardSdk.getSwapHistory({
    query: { interval: 'hour', count: 24 },
  });

  const { meta: liquidityMeta } = await midgardSdk.getLiquidityHistory({
    query: { interval: 'hour', count: 24 },
  });

  const volume24h =
    Number(swapsMeta.totalVolumeUsd) +
    Number(liquidityMeta.addLiquidityVolume) +
    Number(liquidityMeta.withdrawVolume);

  return volume24h;
});

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
    const runeMemberData = await midgardSdk.getMemberDetail(thorchainAddress);
    const assetMemberData = await midgardSdk.getMemberDetail(assetChainAddress);

    return { runeMemberData, assetMemberData };
  },
);

export const reloadPoolMemberDetailByAssetChain = createAsyncThunk(
  'midgard/reloadPoolMemberDetailByAssetChain',
  async ({ assetChainAddress }: { chain: Chain; assetChainAddress: string }) => {
    const assetMemberData = await midgardSdk.getMemberDetail(assetChainAddress);

    return { assetMemberData };
  },
);

export const getLiquidityProviderData = createAsyncThunk(
  'thornode/getLiquidityProvider',
  ({ address, asset }: { asset: string; address: string }) =>
    getRequest<LiquidityProvider>(`${THORNODE_URL}/pool/${asset}/liquidity_provider/${address}`),
);

export const getInboundData = () =>
  getRequest<InboundAddressesItem[]>(`${THORNODE_URL}/inbound_addresses`);

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
