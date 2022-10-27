import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TransactionDetails } from '@thorswap-lib/multichain-core';
import { THORSWAP_AFFILIATE_ADDRESS } from 'config/constants';
import { IS_DEV_API, IS_STAGENET } from 'settings/config';
import { AnnouncementsData } from 'store/externalConfig/types';

import {
  GetProvidersResponse,
  GetTokenPriceParams,
  GetTokenPriceResponse,
  GetTokensQuoteParams,
  GetTxnStatusParams,
  GetTxnStatusResponse,
} from './types';

const baseUrl =
  (IS_DEV_API || IS_STAGENET
    ? import.meta.env.VITE_THORSWAP_DEV_API
    : import.meta.env.VITE_THORSWAP_API) || 'https://dev-api.thorswap.net';

export const thorswapApi = createApi({
  reducerPath: 'thorswap',
  baseQuery: fetchBaseQuery({
    baseUrl,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getSupportedProviders: build.query<string[], void>({
      query: () => `/aggregator/providers/supportedProviders`,
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
        });

        if (providers) {
          providers.forEach((provider) => {
            queryParams.append('providers', provider);
          });
        }

        if (affiliateBasisPoints) {
          queryParams.append('affiliateBasisPoints', affiliateBasisPoints);
          queryParams.append('affiliateAddress', THORSWAP_AFFILIATE_ADDRESS);
        }

        return `/aggregator/tokens/quote?${queryParams.toString()}`;
      },
    }),

    getProviders: build.query<GetProvidersResponse, void>({
      query: () => `/tokenlist/providers`,
    }),

    getTokenCachedPrices: build.query<GetTokenPriceResponse, GetTokenPriceParams>({
      query: (tokens) => {
        const body = new URLSearchParams();
        tokens.forEach((token) => body.append('tokens', JSON.stringify(token)));

        return {
          method: 'POST',
          url: `/tokenlist/cached-price`,
          body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
      },
    }),

    getTxnStatus: build.query<GetTxnStatusResponse, GetTxnStatusParams>({
      query: ({ txid, type, from }) => {
        const queryParams = new URLSearchParams({ txid });
        if (from) queryParams.append('from', from);
        if (type) queryParams.append('type', type);

        return `/apiusage/txn?${queryParams.toString()}`;
      },
    }),

    getAnnouncements: build.query<AnnouncementsData, void>({
      query: () => `/announcements`,
    }),
  }),
});

export const {
  useGetTxnStatusQuery,
  useGetProvidersQuery,
  useGetTokenCachedPricesQuery,
  useGetTokensQuoteQuery,
  useGetSupportedProvidersQuery,
  useGetAnnouncementsQuery,
} = thorswapApi;
