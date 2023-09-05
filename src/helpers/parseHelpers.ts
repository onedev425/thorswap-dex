import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import type { GetTokenPriceIdentifiers } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynth,
  symbol,
  chain,
}: AssetEntity): GetTokenPriceIdentifiers => ({
  identifier: `${chain}${isSynth ? '/' : '.'}${symbol}`,
});

export const parseToPercent = (basis: number | string = 0, decimals: number = 2) =>
  `${(parseFloat(`${basis}`) * 100).toFixed(decimals)} %`;

export const parsePercentToBasis = (percent: number | string = 0) => parseFloat(`${percent}`) * 100;
