import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { GetTokenPriceParams } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynth,
  symbol,
  chain,
}: AssetEntity): GetTokenPriceParams[number] => ({
  identifier: `${chain}${isSynth ? '/' : '.'}${symbol}`,
});
