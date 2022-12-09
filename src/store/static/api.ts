import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IS_DEV_API, STATIC_API } from 'settings/config';
import { GetProviderTokensParams } from 'store/thorswap/types';

/**
 * This is not proper way of having 2 urls but API can't make it one endpoint under different base urls
 */
const baseUrl = IS_DEV_API
  ? 'https://static-tokenlist-dev.thorswap.net'
  : `${STATIC_API}/token-list`;

export const staticApi = createApi({
  reducerPath: 'static',
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: '',
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `${baseUrl}/${name}.json`,
    }),
  }),
});

export const { useLazyGetTokenListQuery, useGetTokenListQuery } = staticApi;
