import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FullMemberPool,
  PoolDetail,
  PoolPeriods,
  THORNameDetails,
} from '@thorswap-lib/midgard-sdk';
import { MIDGARD_URL } from 'settings/config';
import { MidgardTradeHistory } from 'store/midgard/types';

const microgardUrl = 'https://mu.thorswap.net';

export const midgardApi = createApi({
  reducerPath: 'midgardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${MIDGARD_URL}/v2`,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getFullMember: build.query<FullMemberPool[], string[]>({
      query: (addresses) => `${microgardUrl}/fullmember?address=${addresses.join(',')}`,
      keepUnusedDataFor: 10,
    }),
    getPools: build.query<PoolDetail[], PoolPeriods | void>({
      query: (period) => `/pools${period ? `?period=${period}` : ''}`,
      keepUnusedDataFor: 300,
    }),
    getStats: build.query<any, void>({
      query: () => '/stats',
      keepUnusedDataFor: 300,
    }),
    getMonthlyTradeVolume: build.query<MidgardTradeHistory, void>({
      query: () => `${microgardUrl}/ts-swaps?interval=month&count=1&unique=true`,
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
