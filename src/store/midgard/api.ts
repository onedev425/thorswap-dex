import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FullMemberPool,
  PoolDetail,
  PoolPeriods,
  THORNameDetails,
} from '@thorswap-lib/midgard-sdk';
import { MIDGARD_URL } from 'settings/config';
import { MidgardTradeHistory } from 'store/midgard/types';

export const midgardApi = createApi({
  reducerPath: 'midgardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${MIDGARD_URL}/v2`,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getFullMember: build.query<FullMemberPool[], string[]>({
      query: (addresses) => `/full_member?address=${addresses.join(',')}`,
      keepUnusedDataFor: 10,
    }),
    getPools: build.query<PoolDetail[], PoolPeriods | void>({
      query: (period) => `/pools${period ? `?period=${period}` : ''}`,
      keepUnusedDataFor: 300,
    }),
    getMonthlyTradeVolume: build.query<MidgardTradeHistory, void>({
      query: () => '/history/ts-swaps?interval=month&count=1&unique=true',
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
  useGetTNSDetailQuery,
  useLazyGetTNSDetailQuery,
  useGetTNSByOwnerAddressQuery,
  useGetMonthlyTradeVolumeQuery,
  useGetFullMemberQuery,
  useGetPoolsQuery,
} = midgardApi;
