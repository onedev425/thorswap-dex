import { Chain } from '@thorswap-lib/types';

export const chainName = (chain: string, full?: boolean) => {
  switch (chain) {
    case Chain.Cosmos:
      return 'Cosmos';
    case Chain.THORChain:
      return full ? 'THORChain' : 'Rune';
    case Chain.Avalanche:
      return full ? 'Avalanche' : 'AVAX';
    case Chain.Binance:
      return full ? 'Binance' : 'BNB';
    case Chain.BitcoinCash:
      return full ? 'Bitcoin Cash' : 'BCH';
    case Chain.Bitcoin:
      return full ? 'Bitcoin' : 'BTC';
    case Chain.Ethereum:
      return full ? 'Ethereum' : 'ETH';
    case Chain.Litecoin:
      return full ? 'Litecoin' : 'LTC';
    case Chain.Solana:
      return full ? 'Solana' : 'SOL';
    case Chain.Doge:
      return full ? 'Dogecoin' : 'DOGE';

    default:
      return chain;
  }
};
