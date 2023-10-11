import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { THORSWAP_AFFILIATE_ADDRESS, THORSWAP_AFFILIATE_ADDRESS_LL } from 'config/constants';
import { IS_LEDGER_LIVE } from 'settings/config';
import type { AnnouncementsData } from 'store/externalConfig/types';
import { getBaseUrl } from 'store/thorswap/getBaseUrl';

import type {
  BorrowQuoteParams,
  BorrowQuoteResponse,
  GetAddressVerifyQuoteParams,
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
  RepayQuoteParams,
  RepayQuoteResponse,
} from './types';

const baseUrl = getBaseUrl();

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

    getAddressVerify: build.query<boolean, GetAddressVerifyQuoteParams>({
      query: ({ addresses = [], chains = [] }) => {
        const queryParams = new URLSearchParams();
        addresses
          .filter((address) => address !== '')
          .forEach((address) => queryParams.append('addresses', address));

        chains
          .filter((chain) => chain !== '')
          .forEach((chain) => queryParams.append('chains', chain));

        return `/aggregator/utils/confirm?${queryParams.toString()}`;
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

    getRepayValue: build.query<RepayQuoteResponse, RepayQuoteParams>({
      query: ({
        repayAsset,
        collateralAsset,
        amountPercentage,
        senderAddress,
        collateralAddress,
      }) => {
        const queryParams = new URLSearchParams({
          repayAsset,
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
        const queryParams = new URLSearchParams({ txid });
        if (from) queryParams.append('from', from);
        if (type) queryParams.append('type', type);

        return `/tracker/txn?${queryParams.toString()}`;
      },
    }),

    getTxnStatusDetails: build.query<GetTxnStatusDetailsResponse, GetAdvancedTrackerStatusPayload>({
      query: (body) => ({
        method: 'POST',
        url: `${baseUrl}/tracker/v2/txn`,
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
  useLazyGetAddressVerifyQuery,
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
