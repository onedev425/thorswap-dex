import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { THORSWAP_AFFILIATE_ADDRESS } from 'config/constants';
import { IS_DEV_API } from 'settings/config';
import { AnnouncementsData } from 'store/externalConfig/types';

import {
  getGasHistoryResponse,
  GetGasPriceRatesResponse,
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
  IThornameForAddressParams,
  IThornameForAddressResponse,
} from './types';

const baseUrl = !IS_DEV_API ? 'https://dev-api.thorswap.net' : 'https://api.thorswap.net';

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

    getAirdropVerify: build.query<any, any>({
      query: ({ address = '' }) => {
        const queryParams = new URLSearchParams({ address });

        return `/aggregator/airdrop/verify?${queryParams.toString()}`;
      },
    }),

    getIsWhitelisted: build.query<any, any>({
      query: ({ address = '' }) => {
        const queryParams = new URLSearchParams({ address });

        return `/aggregator/airdrop/isWhitelisted?${queryParams.toString()}`;
      },
    }),

    getMerkleProof: build.query<any, any>({
      query: ({ address = '' }) => {
        const queryParams = new URLSearchParams({ address });

        return `/aggregator/airdrop/merkleProof?${queryParams.toString()}`;
      },
    }),

    getTokenCachedPrices: build.query<GetTokenPriceResponse, GetTokenPriceParams>({
      query: ({ tokens, options = {} }) => {
        const body = new URLSearchParams();
        tokens
          .filter(
            (token, index, sourceArr) =>
              sourceArr.findIndex((t) => t?.identifier === token.identifier) === index,
          )
          .forEach((token) => body.append('tokens', JSON.stringify(token)));

        if (options.metadata) body.append('metadata', 'true');
        if (options.lookup) body.append('lookup', 'true');
        if (options.sparkline) body.append('sparkline', 'true');
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

    getTxnStatusDetails: build.query<
      GetTxnStatusDetailsResponse,
      GetTxnStatusDetailsParams | GetTxnStatusDetailsUpdateParams
    >({
      query: (body) => ({
        method: 'POST',
        url: `${baseUrl}/apiusage/v2/txn`,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }),
    }),

    getAnnouncements: build.query<AnnouncementsData, void>({
      query: () => '/announcements',
    }),

    getGasPriceRates: build.query<GetGasPriceRatesResponse, void>({
      query: () => '/resource-worker/gasPrice/getAll',
      keepUnusedDataFor: 60,
    }),

    getGasHistory: build.query<getGasHistoryResponse[], void>({
      query: () => `${baseUrl}/resource-worker/gasHistory/getAll`,
      keepUnusedDataFor: 60,
    }),

    getThornamesByAddress: build.query<IThornameForAddressResponse, IThornameForAddressParams>({
      query: ({ address, chain }) => {
        return `${baseUrl}/aggregator/thorname/rlookup?address=${address}&chain=${chain}`;
      },
    }),

    getWithdrawLPMemo: build.query<
      any,
      {
        withdrawType: 'asset' | 'rune' | 'sym';
        percent: string;
        asset: string;
        positionType: 'sym_rune' | 'sym_asset' | 'sym' | 'asset' | 'single_sided';
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams(params);

        return `/aggregator/liquidity/withdraw?${queryParams.toString()}`;
      },
    }),
  }),
});

export const {
  useGetTxnStatusQuery,
  useGetTxnStatusDetailsQuery,
  useGetProvidersQuery,
  useGetTokenCachedPricesQuery,
  useGetTokensQuoteQuery,
  useGetAirdropVerifyQuery,
  useGetIsWhitelistedQuery,
  useGetMerkleProofQuery,
  useGetAnnouncementsQuery,
  useGetGasPriceRatesQuery,
  useGetGasHistoryQuery,
  useGetThornamesByAddressQuery,
  useGetWithdrawLPMemoQuery,
} = thorswapApi;
