import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { GetTokenPriceIdentifiers } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynth,
  symbol,
  chain,
}: AssetEntity): GetTokenPriceIdentifiers => ({
  identifier: `${chain}${isSynth ? '/' : '.'}${symbol}`,
});

export const parseToPercent = (basis: number | string = 0) =>
  `${(parseFloat(`${basis}`) * 100).toFixed(2)} %`;

export const parsePercentToBasis = (percent: number | string = 0) => parseFloat(`${percent}`) * 100;
