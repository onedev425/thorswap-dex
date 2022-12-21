import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { GetTokenPriceParams } from 'store/thorswap/types';

const evmChains = [Chain.Ethereum, Chain.Avalanche];

export const parseAssetToToken = ({
  L1Chain,
  symbol,
  decimal,
  chain,
}: Asset): GetTokenPriceParams[number] => {
  const isEVMAsset = evmChains.includes(L1Chain) && !evmChains.includes(symbol as Chain);
  const [, ticker] = symbol.split('-');

  return {
    address: isEVMAsset ? ticker : '',
    chain: L1Chain,
    decimals: `${decimal}`,
    identifier: `${chain}.${symbol}`,
  };
};
