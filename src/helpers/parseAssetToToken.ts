import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { GetTokenPriceIdentifiers } from 'store/thorswap/types';

export const parseAssetToToken = ({
  isSynth,
  symbol,
  chain,
}: AssetEntity): GetTokenPriceIdentifiers => ({
  identifier: `${chain}${isSynth ? '/' : '.'}${symbol}`,
});
