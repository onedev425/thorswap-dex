import type { AssetValue } from '@swapkit/core';
import type { GetTokenPriceIdentifiers } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynthetic,
  symbol,
  chain,
}: AssetValue): GetTokenPriceIdentifiers => ({
  identifier: `${chain}${isSynthetic ? '/' : '.'}${symbol}`,
});

export const parseToPercent = (basis: number | string = 0, decimals: number = 2) =>
  `${(parseFloat(`${basis}`) * 100).toFixed(decimals)} %`;

export const parsePercentToBasis = (percent: number | string = 0) => parseFloat(`${percent}`) * 100;
