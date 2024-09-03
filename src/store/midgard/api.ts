import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MIDGARD_URL, THORNODE_URL } from "settings/config";
import type { POOLS_TIME_PERIODS_OPTIONS } from "settings/pools";
import type { THORNameDetails } from "types/app";

import type {
  FullMemberPool,
  HistoryParams,
  LiquidityHistoryResponse,
  MidgardTradeHistory,
  MimirData,
  NetworkResponse,
  PoolDetail,
  ProxiedNode,
  SwapHistoryResponse,
} from "./types";

const microgardUrl = "https://mu.thorswap.net";

export const microgardApi = createApi({
  reducerPath: "microgardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: microgardUrl,
    headers: { referer: "https://app.thorswap.finance" },
    mode: "cors",
  }),
  endpoints: (build) => ({
    getStats: build.query<Todo, void>({
      keepUnusedDataFor: 3600,
      query: () => "/stats",
    }),
    getNetwork: build.query<NetworkResponse, void>({
      keepUnusedDataFor: 3600,
      query: () => "/network",
    }),
    getHistoryEarnings: build.query<Todo, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = "day", count = 100 } = {}) =>
        `${MIDGARD_URL}/v2/history/earnings?interval=${interval}&count=${count}`,
    }),
    getHistoryTvl: build.query<Todo, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = "day", count = 100 } = {}) =>
        `${MIDGARD_URL}/v2/history/tvl?interval=${interval}&count=${count}`,
    }),
    getHistorySwaps: build.query<SwapHistoryResponse, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = "day", count = 100 } = {}) =>
        `/swaps?interval=${interval}&count=${count}`,
    }),
    getHistoryLiquidityChanges: build.query<LiquidityHistoryResponse, HistoryParams>({
      keepUnusedDataFor: 3600,
      query: ({ interval = "day", count = 100 } = {}) =>
        `/pooldepth/liquidity_changes?interval=${interval}&count=${count}`,
    }),
    getFullMember: build.query<FullMemberPool[], string[]>({
      keepUnusedDataFor: 10,
      query: (addresses) => `/fullmember?address=${addresses.join(",")}`,
    }),
    getMonthlyTradeVolume: build.query<MidgardTradeHistory, void>({
      keepUnusedDataFor: 300,
      query: () => "/ts-swaps?interval=month&count=1&unique=false",
    }),
    getPools: build.query<PoolDetail[], (typeof POOLS_TIME_PERIODS_OPTIONS)[number] | undefined>({
      keepUnusedDataFor: 60,
      query: (period = "30d") => `/pools?period=${period}`,
    }),

    getTNSByOwnerAddress: build.query<string[], string>({
      query: (address) => `/thorname/owner/${address}`,
    }),
    getTNSDetail: build.query<THORNameDetails, string>({
      query: (thorname) => `/thorname/lookup/${thorname}`,
    }),

    /**
     * THORNODE API
     */
    getLastblock: build.query<Todo, void>({
      query: () => `${THORNODE_URL}/lastblock`,
      keepUnusedDataFor: 6,
    }),
    getQueue: build.query<Todo, void>({
      query: () => `${THORNODE_URL}/queue`,
      keepUnusedDataFor: 60,
    }),
    getMimir: build.query<MimirData, void>({
      query: () => `${THORNODE_URL}/mimir`,
      keepUnusedDataFor: 60,
    }),
    getConstants: build.query<MimirData, void>({
      query: () => `${THORNODE_URL}/constants`,
      keepUnusedDataFor: 60,
    }),
    getNodes: build.query<ProxiedNode[], void>({
      query: () => `${THORNODE_URL}/nodes`,
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const {
  useGetFullMemberQuery,
  useGetHistoryEarningsQuery,
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetHistoryTvlQuery,
  useGetMonthlyTradeVolumeQuery,
  useGetNetworkQuery,
  useGetPoolsQuery,
  useGetStatsQuery,
  useGetTNSByOwnerAddressQuery,
  useLazyGetTNSDetailQuery,
  useGetLastblockQuery,
  useGetMimirQuery,
  useGetConstantsQuery,
  useGetNodesQuery,
  useGetQueueQuery,
} = microgardApi;
