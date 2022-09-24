import { Asset } from '@thorswap-lib/multichain-core';
import { Chain, ChainId } from '@thorswap-lib/types';
import { GetTokenPriceParams } from 'store/thorswap/types';

const chainsToCheck = [Chain.Ethereum, Chain.Avalanche];

export const parseAssetToToken = ({
  L1Chain,
  symbol,
  decimal,
  chain,
}: Asset): GetTokenPriceParams[number] => {
  const isEVMAsset = chainsToCheck.includes(L1Chain) && !chainsToCheck.includes(symbol as Chain);
  const [, ticker] = symbol.split('-');

  return {
    address: isEVMAsset ? ticker : '',
    chain: isEVMAsset
      ? L1Chain === Chain.Ethereum
        ? ChainId.Ethereum
        : L1Chain === Chain.Avalanche
        ? ChainId.Avalanche
        : 'thorchain'
      : 'thorchain',
    decimals: `${decimal}`,
    identifier: `${chain}.${symbol}`,
  };
};
