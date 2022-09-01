import { Asset } from '@thorswap-lib/multichain-sdk';
import { GetTokenPriceParams } from 'store/thorswap/types';

export const parseAssetToToken = ({
  chain,
  symbol,
  decimal,
}: Asset): GetTokenPriceParams[number] => {
  const isOnETH = chain === 'ETH' && symbol !== 'ETH';

  return {
    address: isOnETH ? symbol.split('-')[1] : '',
    chain: isOnETH ? 1 : 'thorchain',
    decimals: `${decimal || isOnETH ? 18 : 8}`,
    identifier: `${chain}.${symbol}`,
  };
};
