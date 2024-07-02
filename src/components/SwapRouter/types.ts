import type { GetTokensQuoteResponse } from "store/thorswap/types";

export type RouteAssetType = { identifier: string; logoURL: string };
export type SwapPartsType = {
  percentage: number;
  providerLogoURL: string;
  provider: string;
};

export type SwapGraphType = {
  name: string;
  logoURL?: string;
  chainSwaps: {
    fromAsset: RouteAssetType;
    toAsset: RouteAssetType;
    swapParts: SwapPartsType[];
  }[][];
}[];

export type RouteWithApproveType = GetTokensQuoteResponse["routes"][number] & {
  isApproved: boolean;
};
