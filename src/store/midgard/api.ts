import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FullMemberPool, ProxiedNode, THORNameDetails } from '@thorswap-lib/midgard-sdk';
import { MIDGARD_URL, THORNODE_URL } from 'settings/config';

import type {
  HistoryParams,
  MidgardTradeHistory,
  MimirData,
  NetworkResponse,
  PoolDetail,
  PoolsPeriod,
  SwapHistoryResponse,
} from './types';

const microgardUrl = 'https://mu.thorswap.net';

export const midgardApi = createApi({
  reducerPath: 'midgardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: microgardUrl,
    headers: { referer: 'https://app.thorswap.finance' },
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getStats: build.query<any, void>({
      keepUnusedDataFor: 3600,
      query: () => `/stats`,
    }),
    getNetwork: build.query<NetworkResponse, void>({
      keepUnusedDataFor: 3600,
      query: () => `${MIDGARD_URL}/v2/network`,
    }),
    getHistoryEarnings: build.query<any, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = 'day', count = 100 } = {}) =>
        `${MIDGARD_URL}/v2/history/earnings?interval=${interval}&count=${count}`,
    }),
    getHistoryTvl: build.query<any, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = 'day', count = 100 } = {}) =>
        `${MIDGARD_URL}/v2/history/tvl?interval=${interval}&count=${count}`,
    }),
    getHistorySwaps: build.query<SwapHistoryResponse, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = 'day', count = 100 } = {}) =>
        `/swaps?interval=${interval}&count=${count}`,
    }),
    getHistoryLiquidityChanges: build.query<any, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = 'day', count = 100 } = {}) =>
        `${MIDGARD_URL}/v2/history/liquidity_changes?interval=${interval}&count=${count}`,
    }),
    getFullMember: build.query<FullMemberPool[], string[]>({
      keepUnusedDataFor: 10,
      query: (addresses) => `/fullmember?address=${addresses.join(',')}`,
    }),
    getMonthlyTradeVolume: build.query<MidgardTradeHistory, void>({
      keepUnusedDataFor: 300,
      query: () => '/ts-swaps?interval=month&count=1&unique=true',
    }),
    getPools: build.query<PoolDetail[], PoolsPeriod | void>({
      keepUnusedDataFor: 60,
      query: (period = '30d') => `/pools?period=${period}`,
    }),

    getTNSByOwnerAddress: build.query<string[], string>({
      query: (address) => `${MIDGARD_URL}/v2/thorname/owner/${address}`,
    }),
    getTNSDetail: build.query<THORNameDetails, string>({
      query: (thorname) => `${MIDGARD_URL}/v2/thorname/lookup/${thorname}`,
    }),

    /**
     * THORNODE API
     */
    getLastblock: build.query<any, void>({
      query: () => `${THORNODE_URL}/lastblock`,
      keepUnusedDataFor: 6,
    }),
    getQueue: build.query<any, void>({
      query: () => `${THORNODE_URL}/queue`,
      keepUnusedDataFor: 60,
    }),
    getMimir: build.query<MimirData, void>({
      query: () => `${THORNODE_URL}/mimir`,
      keepUnusedDataFor: 60,
    }),
    getNodes: build.query<ProxiedNode[], void>({
      query: () => `${THORNODE_URL}/nodes`,
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const {
  useGetFullMemberQuery,
  useGetHistoryEarningsQuery,
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetHistoryTvlQuery,
  useGetMonthlyTradeVolumeQuery,
  useGetNetworkQuery,
  useGetPoolsQuery,
  useGetStatsQuery,
  useGetTNSByOwnerAddressQuery,
  useGetTNSDetailQuery,
  useLazyGetTNSDetailQuery,

  useGetLastblockQuery,
  useGetMimirQuery,
  useGetNodesQuery,
  useGetQueueQuery,
} = midgardApi;
