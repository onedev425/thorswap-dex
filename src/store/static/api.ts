import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IS_DEV_API } from 'settings/config';
import type { GetProviderTokensParams } from 'store/thorswap/types';

/**
 * This is not proper way of having 2 urls but API can't make it one endpoint under different base urls
 */
// TODO change this once, api v2 prod is ready to serve maya lists
const baseUrl = IS_DEV_API
  ? 'https://dev-api.swapkit.dev/tokens'
  : 'https://api.swapkit.dev/tokens';

export const staticApi = createApi({
  reducerPath: 'static',
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    headers: { referer: 'https://app.thorswap.finance' },
    baseUrl: '',
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `${baseUrl}?provider=${name}`,
    }),
  }),
});

export const { useLazyGetTokenListQuery, useGetTokenListQuery } = staticApi;
