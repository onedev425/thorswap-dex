import type { AssetValue } from "@swapkit/sdk";
import type { GetTokenPriceIdentifiers } from "store/thorswap/types";

export const parseAssetToToken = (asset: AssetValue): GetTokenPriceIdentifiers => ({
  identifier: asset.isSynthetic ? asset.symbol : asset.toString(),
});

export const parseToPercent = (basis: number | string = 0, decimals = 2) => {
  const value = Number.parseFloat(`${basis}`) * 100;
  return value ? `${value.toFixed(decimals)} %` : "N/A";
};

export const parsePercentToBasis = (percent: number | string = 0) =>
  Number.parseFloat(`${percent}`) * 100;
