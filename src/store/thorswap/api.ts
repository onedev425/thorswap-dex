import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TransactionDetails } from '@thorswap-lib/cross-chain-api-sdk'
import { THORSWAP_AFFILIATE_ADDRESS } from 'config/constants'

import {
  GetTxnStatusParams,
  GetProvidersResponse,
  GetTokenPriceParams,
  GetTokenPriceResponse,
  GetTokensQuoteParams,
  GetTxnStatusResponse,
} from './types'

const baseUrl =
  import.meta.env.VITE_THORSWAP_API || 'https://dev-api.thorswap.net'

export const thorswapApi = createApi({
  reducerPath: 'thorswap',
  baseQuery: fetchBaseQuery({
    baseUrl,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getSupportedProviders: build.query<string[], void>({
      query: () => '/aggregator/providers/supportedProviders',
    }),
    getTokensQuote: build.query<TransactionDetails, GetTokensQuoteParams>({
      query: ({
        providers,
        senderAddress = '',
        recipientAddress = '',
        affiliateBasisPoints,
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

        if (affiliateBasisPoints) {
          queryParams.append('affiliateBasisPoints', affiliateBasisPoints)
          queryParams.append('affiliateAddress', THORSWAP_AFFILIATE_ADDRESS)
        }

        return `/aggregator/tokens/quote?${queryParams.toString()}`
      },
    }),

    getProviders: build.query<GetProvidersResponse, void>({
      query: () => '/tokenlist/providers',
    }),

    getTokenCachedPrices: build.query<
      GetTokenPriceResponse,
      GetTokenPriceParams
    >({
      query: (tokens) => {
        const body = new URLSearchParams()
        tokens.forEach((token) => body.append('tokens', JSON.stringify(token)))

        return {
          method: 'POST',
          url: '/tokenlist/cached-price',
          body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      },
    }),

    getTxnStatus: build.query<GetTxnStatusResponse, GetTxnStatusParams>({
      query: (params) =>
        `/apiusage/txn?${new URLSearchParams(params).toString()}`,
    }),
  }),
})

export const {
  useGetTxnStatusQuery,
  useGetProvidersQuery,
  useGetTokenCachedPricesQuery,
  useGetTokensQuoteQuery,
  useGetSupportedProvidersQuery,
} = thorswapApi
