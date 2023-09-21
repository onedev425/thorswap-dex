import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  FullMemberPool,
  PoolDetail,
  PoolPeriods,
  THORNameDetails,
} from '@thorswap-lib/midgard-sdk';
import { MIDGARD_URL } from 'settings/config';
import type { MidgardTradeHistory } from 'store/midgard/types';

const microgardUrl = 'https://mu.thorswap.net';

export const midgardApi = createApi({
  reducerPath: 'midgardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${MIDGARD_URL}/v2`,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getStats: build.query<any, void>({ query: () => '/stats', keepUnusedDataFor: 300 }),
    getNetwork: build.query<any, void>({ query: () => '/network', keepUnusedDataFor: 300 }),
    getHistoryEarnings: build.query<any, void>({
      query: () => '/history/earnings?interval=day&count=100',
      keepUnusedDataFor: 3600,
    }),
    getHistoryTvl: build.query<any, void>({
      query: () => '/history/tvl?interval=day&count=100',
      keepUnusedDataFor: 3600,
    }),
    getHistorySwaps: build.query<any, void>({
      query: () => '/history/swaps?interval=day&count=100',
      keepUnusedDataFor: 3600,
    }),
    getHistoryLiquidityChanges: build.query<any, void>({
      query: () => '/history/liquidity_changes?interval=day&count=100',
      keepUnusedDataFor: 3600,
    }),
    getFullMember: build.query<FullMemberPool[], string[]>({
      query: (addresses) => `/full_member?address=${addresses.join(',')}`,
      keepUnusedDataFor: 10,
    }),
    getPools: build.query<PoolDetail[], PoolPeriods | void>({
      query: (period) => `/pools${period ? `?period=${period}` : ''}`,
      keepUnusedDataFor: 60,
    }),
    getMonthlyTradeVolume: build.query<MidgardTradeHistory, void>({
      query: () => `${microgardUrl}/ts-swaps?interval=month&count=1&unique=true`,
      keepUnusedDataFor: 300,
    }),

    getTNSByOwnerAddress: build.query<string[], string>({
      query: (address) => `/thorname/owner/${address}`,
    }),
    getTNSDetail: build.query<THORNameDetails, string>({
      query: (thorname) => `/thorname/lookup/${thorname}`,
    }),
  }),
});

export const {
  useGetFullMemberQuery,
  useGetMonthlyTradeVolumeQuery,
  useGetPoolsQuery,
  useGetTNSByOwnerAddressQuery,
  useGetTNSDetailQuery,
  useGetStatsQuery,
  useLazyGetTNSDetailQuery,
} = midgardApi;
