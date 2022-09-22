import { Asset } from '@thorswap-lib/multichain-core';
import { Chain, ChainId } from '@thorswap-lib/types';
import { GetTokenPriceParams } from 'store/thorswap/types';

const chainsToCheck = [Chain.Ethereum, Chain.Avalanche];

export const parseAssetToToken = ({
  L1Chain,
  chain,
  symbol,
  decimal,
}: Asset): GetTokenPriceParams[number] => ({
  address:
    chainsToCheck.includes(L1Chain) && !chainsToCheck.includes(symbol as Chain)
      ? symbol.split('-')[1]
      : '',
  chain:
    L1Chain === Chain.Ethereum
      ? ChainId.Ethereum
      : L1Chain === Chain.Avalanche
      ? ChainId.Avalanche
      : 'thorchain',
  decimals: `${decimal}`,
  identifier: `${chain}.${symbol}`,
});
