import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { GetProviderTokensParams } from 'store/thorswap/types'

const STATIC_URL = 'https://static.thorswap.net'

export const staticApi = createApi({
  reducerPath: 'static',
  baseQuery: fetchBaseQuery({
    baseUrl: STATIC_URL,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `/token-list/${name}.json`,
    }),
  }),
})

export const { useLazyGetTokenListQuery } = staticApi
