import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { THORSWAP_AFFILIATE_ADDRESS, THORSWAP_AFFILIATE_ADDRESS_LL } from 'config/constants';
import { IS_DEV_API, IS_LEDGER_LIVE, IS_STAGENET } from 'settings/config';
import { AnnouncementsData } from 'store/externalConfig/types';

import {
  BorrowQuoteParams,
  BorrowQuoteResponse,
  GetAdvancedTrackerStatusPayload,
  getGasHistoryResponse,
  GetGasPriceRatesResponse,
  GetProvidersResponse,
  GetTokenPriceParams,
  GetTokenPriceResponse,
  GetTokensQuoteParams,
  GetTokensQuoteResponse,
  GetTxnStatusDetailsResponse,
  GetTxnStatusParams,
  GetTxnStatusResponse,
  IThornameForAddressParams,
  IThornameForAddressResponse,
  LendingAssetResponse,
  LendingStatusResponse,
  LoansResponse,
} from './types';

const baseUrl =
  IS_DEV_API || IS_STAGENET ? 'https://dev-api.thorswap.net' : 'https://api.thorswap.net';

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
          queryParams.append(
            'affiliateAddress',
            IS_LEDGER_LIVE ? THORSWAP_AFFILIATE_ADDRESS_LL : THORSWAP_AFFILIATE_ADDRESS,
          );
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

    getBorrowQuote: build.query<BorrowQuoteResponse, BorrowQuoteParams>({
      query: ({ assetIn, assetOut, slippage, amount, senderAddress, recipientAddress }) => {
        const queryParams = new URLSearchParams({
          assetIn,
          assetOut,
          amount,
          senderAddress,
          recipientAddress,
          slippage,
          affiliateBasisPoints: '0',
          affiliateAddress: IS_LEDGER_LIVE
            ? THORSWAP_AFFILIATE_ADDRESS_LL
            : THORSWAP_AFFILIATE_ADDRESS,
        });

        return `/aggregator/lending/borrow?${queryParams.toString()}`;
      },
      keepUnusedDataFor: 0,
    }),

    getRepayValue: build.query<{ repayAssetAmount: string }, any>({
      query: ({ assetIn, collateralAsset, amountPercentage, senderAddress, collateralAddress }) => {
        const queryParams = new URLSearchParams({
          assetIn,
          collateralAsset,
          amountPercentage,
          senderAddress,
          collateralAddress,
          affiliateBasisPoints: '0',
          affiliateAddress: IS_LEDGER_LIVE
            ? THORSWAP_AFFILIATE_ADDRESS_LL
            : THORSWAP_AFFILIATE_ADDRESS,
        });

        return `/aggregator/lending/repay?${queryParams.toString()}`;
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
        const queryParams = new URLSearchParams({ txid, isStreamingSwap: 'true' });
        if (from) queryParams.append('from', from);
        if (type) queryParams.append('type', type);

        return `/apiusage/txn?${queryParams.toString()}`;
      },
    }),

    getTxnStatusDetails: build.query<GetTxnStatusDetailsResponse, GetAdvancedTrackerStatusPayload>({
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

    getLoans: build.query<LoansResponse, { asset: string; address: string }>({
      query: ({ asset, address }) =>
        `${baseUrl}/aggregator/lending/loans?asset=${asset}&address=${address}`,
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

    getLendingAssets: build.query<LendingAssetResponse[], void>({
      query: () => `${baseUrl}/aggregator/lending/assets`,
    }),
    getLendingStatus: build.query<LendingStatusResponse, void>({
      query: () => `${baseUrl}/aggregator/lending/status`,
    }),
  }),
});

export const {
  useGetTxnStatusQuery,
  useGetTxnStatusDetailsQuery,
  useGetProvidersQuery,
  useGetTokenCachedPricesQuery,
  useGetTokensQuoteQuery,
  useLazyGetLoansQuery,
  useGetAirdropVerifyQuery,
  useGetIsWhitelistedQuery,
  useGetMerkleProofQuery,
  useGetBorrowQuoteQuery,
  useGetRepayValueQuery,
  useGetAnnouncementsQuery,
  useGetGasPriceRatesQuery,
  useGetGasHistoryQuery,
  useGetThornamesByAddressQuery,
  useGetWithdrawLPMemoQuery,
  useGetLendingAssetsQuery,
  useGetLendingStatusQuery,
} = thorswapApi;
