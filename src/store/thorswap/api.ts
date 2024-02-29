import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { THORSWAP_AFFILIATE_ADDRESS, THORSWAP_AFFILIATE_ADDRESS_LL } from 'config/constants';
import { IS_DEV_API, IS_LEDGER_LIVE, IS_PROD, IS_STAGENET } from 'settings/config';
import type { AnnouncementsData } from 'store/externalConfig/types';

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
  LendingAssetResponse,
  LendingStatusResponse,
  LoansResponse,
  RepayQuoteParams,
  RepayQuoteResponse,
} from './types';

const baseUrl = IS_STAGENET
  ? 'https://api-stagenet.thorswap.net'
  : IS_DEV_API
    ? 'https://dev-api.thorswap.net'
    : 'https://api.thorswap.net';

export const thorswapApi = createApi({
  reducerPath: 'thorswap',
  baseQuery: fetchBaseQuery({
    baseUrl,
    headers: {
      'x-api-key': IS_PROD ? import.meta.env.VITE_API_KEY : import.meta.env.VITE_STAGING_API_KEY,
      referer: 'https://app.thorswap.finance',
    },
    mode: 'cors',
  }),
  endpoints: (build) => ({
    getTokensQuote: build.query<GetTokensQuoteResponse, GetTokensQuoteParams>({
      query: ({
        senderAddress = '',
        recipientAddress = '',
        affiliateBasisPoints,
        affiliateAddress,
        ...rest
      }) => {
        const queryParams = new URLSearchParams({ ...rest, senderAddress, recipientAddress });

        if (affiliateBasisPoints) {
          queryParams.append('affiliateBasisPoints', affiliateBasisPoints);
        }
        if (affiliateAddress) {
          queryParams.append('affiliateAddress', affiliateAddress);
        }

        queryParams.append('isAffiliateFeeFlat', 'true');

        return `${baseUrl}/aggregator/tokens/quote?${queryParams.toString()}`;
      },
    }),

    getChainflipQuote: build.query<any, GetTokensQuoteParams>({
      query: ({
        senderAddress = '',
        recipientAddress = '',
        affiliateBasisPoints,
        affiliateAddress,
        ...rest
      }) => {
        const queryParams = new URLSearchParams({ ...rest, senderAddress, recipientAddress });

        if (affiliateBasisPoints) {
          queryParams.append('affiliateBasisPoints', affiliateBasisPoints);
        }
        if (affiliateAddress) {
          queryParams.append('affiliateAddress', affiliateAddress);
        }

        queryParams.append('isAffiliateFeeFlat', 'true');

        return {
          method: 'POST',
          body: JSON.stringify({
            sellAsset: rest.sellAsset,
            buyAsset: rest.buyAsset,
            sellAmount: Number(rest.sellAmount),
            sourceAddress: senderAddress,
            destinationAddress: recipientAddress,
            providers: ['CHAINFLIP'],
          }),
          url: `https://gateway-d32mo7lc.uc.gateway.dev/quote`,
          headers: { 'Content-Type': 'application/json' },
        };
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

    getAddressVerify: build.query<{ confirm: boolean }, GetAddressVerifyQuoteParams>({
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
      keepUnusedDataFor: 60,
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
  useGetChainflipQuoteQuery,
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
  useGetWithdrawLPMemoQuery,
  useGetLendingAssetsQuery,
  useGetLendingStatusQuery,
} = thorswapApi;
