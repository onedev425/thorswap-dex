import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TransactionDetails } from '@thorswap-lib/multichain-sdk'

import { PATHFINDER_API_URL } from 'settings/config'

type GetTokensQuoteParams = {
  affiliateBasisPoints?: string // is this the param?
  buyAsset: string
  providers?: string[]
  recipientAddress?: string
  sellAmount: string
  sellAsset: string
  senderAddress?: string
  slippage: string
}

export const pathfinderApi = createApi({
  reducerPath: 'pathfinder',
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    baseUrl: PATHFINDER_API_URL,
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoints: (build) => ({
    getSupportedProviders: build.query<string[], void>({
      query: () => '/providers/supportedProviders',
    }),
    getTokensQuote: build.query<TransactionDetails, GetTokensQuoteParams>({
      query: ({
        providers,
        senderAddress = '',
        recipientAddress = '',
        ...rest
      }) => {
        const queryParams = new URLSearchParams({
          ...rest,
          senderAddress,
          recipientAddress,
        })

        if (providers) {
          providers.forEach((provider) => {
            queryParams.append('providers', provider)
          })
        }

        return `/tokens/quote?${queryParams.toString()}`
      },
    }),
  }),
})

export const { useGetTokensQuoteQuery, useGetSupportedProvidersQuery } =
  pathfinderApi
