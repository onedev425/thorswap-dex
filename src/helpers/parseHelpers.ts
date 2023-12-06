import type { AssetValue } from '@swapkit/core';
import type { GetTokenPriceIdentifiers } from 'store/thorswap/types';

export const parseAssetToToken = (asset: AssetValue): GetTokenPriceIdentifiers => ({
  identifier: asset.isSynthetic ? asset.symbol : asset.toString(),
});

export const parseToPercent = (basis: number | string = 0, decimals: number = 2) => {
  const value = parseFloat(`${basis}`) * 100;
  return value ? `${value.toFixed(decimals)} %` : 'N/A';
};

export const parsePercentToBasis = (percent: number | string = 0) => parseFloat(`${percent}`) * 100;
