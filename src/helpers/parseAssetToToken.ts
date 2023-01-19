import { Asset } from '@thorswap-lib/multichain-core';
import { GetTokenPriceParams } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynth,
  symbol,
  chain,
}: Asset): GetTokenPriceParams[number] => ({
  identifier: `${chain}${isSynth ? '/' : '.'}${symbol}`,
});
