import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { THORSWAP_AFFILIATE_ADDRESS } from 'config/constants';
import { IS_DEV_API } from 'settings/config';
import { AnnouncementsData } from 'store/externalConfig/types';

import {
  GetProvidersResponse,
  GetTokenPriceParams,
  GetTokenPriceResponse,
  GetTokensQuoteParams,
  GetTokensQuoteResponse,
  GetTxnStatusDetailsParams,
  GetTxnStatusDetailsResponse,
  GetTxnStatusDetailsUpdateParams,
  GetTxnStatusParams,
  GetTxnStatusResponse,
} from './types';

const baseUrl = IS_DEV_API ? 'https://dev-api.thorswap.net' : 'https://api.thorswap.net';

export const thorswapApi = createApi({
  reducerPath: 'thorswap',
  baseQuery: fetchBaseQuery({
    baseUrl,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokensQuote: build.query<GetTokensQuoteResponse, GetTokensQuoteParams>({
      query: ({ senderAddress = '', recipientAddress = '', affiliateBasisPoints, ...rest }) => {
        const queryParams = new URLSearchParams({ ...rest, senderAddress, recipientAddress });

        if (affiliateBasisPoints) {
          queryParams.append('affiliateBasisPoints', affiliateBasisPoints);
          queryParams.append('affiliateAddress', THORSWAP_AFFILIATE_ADDRESS);
        }

        queryParams.append('isAffiliateFeeFlat', 'true');

        return `${baseUrl}/aggregator/tokens/quote?${queryParams.toString()}`;
      },
    }),

    getProviders: build.query<GetProvidersResponse, void>({
      query: () => '/tokenlist/providers',
    }),

    getTokenCachedPrices: build.query<GetTokenPriceResponse, GetTokenPriceParams>({
      query: ({ tokens, options = {} }) => {
        const body = new URLSearchParams();
        tokens.forEach((token) => body.append('tokens', JSON.stringify(token)));

        if (options.includeMetadata) {
          body.append('metadata', 'true');
        }
        return {
          method: 'POST',
          url: '/tokenlist/cached-price',
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

    getTxnStatusDetails: build.query<
      GetTxnStatusDetailsResponse,
      GetTxnStatusDetailsParams | GetTxnStatusDetailsUpdateParams
    >({
      query: (body) => {
        return {
          method: 'POST',
          url: `${baseUrl}/apiusage/v2/txn`,
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        };
      },
    }),

    getAnnouncements: build.query<AnnouncementsData, void>({
      query: () => '/announcements',
    }),
  }),
});

export const {
  useGetTxnStatusQuery,
  useGetTxnStatusDetailsQuery,
  useGetProvidersQuery,
  useGetTokenCachedPricesQuery,
  useGetTokensQuoteQuery,
  useGetAnnouncementsQuery,
} = thorswapApi;
