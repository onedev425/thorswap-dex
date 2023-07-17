import { Chain } from '@thorswap-lib/types';

export const chainName = (chain: string, full?: boolean) => {
  switch (chain) {
    case Chain.Cosmos:
      return 'Cosmos';
    case Chain.THORChain:
      return full ? 'THORChain' : 'Rune';
    case Chain.Avalanche:
      return full ? 'Avalanche' : Chain.Avalanche;
    case Chain.Binance:
      return full ? 'Binance' : Chain.Binance;
    case Chain.BitcoinCash:
      return full ? 'Bitcoin Cash' : Chain.BitcoinCash;
    case Chain.Bitcoin:
      return full ? 'Bitcoin' : Chain.Bitcoin;
    case Chain.Ethereum:
      return full ? 'Ethereum' : Chain.Ethereum;
    case Chain.Litecoin:
      return full ? 'Litecoin' : Chain.Litecoin;
    case Chain.Dogecoin:
      return full ? 'Dogecoin' : Chain.Dogecoin;

    default:
      return chain;
  }
};
