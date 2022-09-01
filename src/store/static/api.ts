import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetProviderTokensParams } from 'store/thorswap/types';

export const staticApi = createApi({
  reducerPath: 'static',
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_THORSWAP_STATIC_API || 'https://static.thorswap.net',
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `/token-list/${name}.json`,
    }),
  }),
});

export const { useLazyGetTokenListQuery, useGetTokenListQuery } = staticApi;
