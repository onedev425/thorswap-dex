import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IS_DEV_API, IS_STAGENET, STATIC_API } from 'settings/config';
import { GetProviderTokensParams } from 'store/thorswap/types';

export const staticApi = createApi({
  reducerPath: 'static',
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: STATIC_API,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `/token-list/${IS_DEV_API || IS_STAGENET ? 'dev/' : ''}${name}.json`,
    }),
  }),
});

export const { useLazyGetTokenListQuery, useGetTokenListQuery } = staticApi;
