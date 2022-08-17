import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { TOKEN_LIST_API_URL } from 'settings/config'

import {
  GetTokenPriceParams,
  GetTokenPriceResponse,
  GetProvidersResponse,
} from './types'

export const tokensApi = createApi({
  reducerPath: 'tokens',
  baseQuery: fetchBaseQuery({
    baseUrl: TOKEN_LIST_API_URL,
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoints: (build) => ({
    getTokenCachedPrices: build.query<
      GetTokenPriceResponse,
      GetTokenPriceParams
    >({
      query: (tokens) => {
        const body = new URLSearchParams()
        tokens.forEach((token) => body.append('tokens', JSON.stringify(token)))

        return {
          method: 'POST',
          url: '/cached-price',
          body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      },
    }),

    getProviders: build.query<GetProvidersResponse, void>({
      query: () => '/providers',
    }),
  }),
})

export const { useGetProvidersQuery, useGetTokenCachedPricesQuery } = tokensApi
