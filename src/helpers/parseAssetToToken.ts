import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { GetTokenPriceParams } from 'store/thorswap/types';

export const parseAssetToToken = ({
  L1Chain,
  symbol,
  chain,
}: Asset): GetTokenPriceParams[number] => {
  const isSynth = L1Chain === Chain.THORChain && symbol !== 'RUNE';

  return {
    ...(!isSynth
      ? {
          identifier: `${chain}.${symbol}`,
        }
      : {
          identifier: `${chain}/${symbol}`,
        }),
  };
};
