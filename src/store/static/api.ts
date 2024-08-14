import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IS_DEV_API } from "settings/config";
import type { GetProviderTokensParams, GetWhitelistTokensResponse } from "store/thorswap/types";

const baseUrl = IS_DEV_API
  ? "https://dev-api.swapkit.dev/tokens"
  : "https://api.swapkit.dev/tokens";

export const staticApi = createApi({
  reducerPath: "static",
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    headers: { referer: "https://app.thorswap.finance" },
    baseUrl,
    mode: "cors",
  }),
  endpoints: (build) => ({
    getTokenList: build.query<GetProviderTokensParams, string>({
      query: (name) => `?provider=${name}`,
    }),
    getWhiteListPools: build.query<GetWhitelistTokensResponse[], void>({
      query: () => "/whitelist/pools",
    }),
    getWhiteListTokens: build.query<GetWhitelistTokensResponse[], void>({
      query: () => "/whitelist/tokens",
    }),
  }),
});

export const {
  useLazyGetTokenListQuery,
  useGetTokenListQuery,
  useGetWhiteListPoolsQuery,
  useGetWhiteListTokensQuery,
  useLazyGetWhiteListPoolsQuery,
  useLazyGetWhiteListTokensQuery,
} = staticApi;
