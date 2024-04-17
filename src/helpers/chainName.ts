import { Chain } from '@swapkit/core';

export const chainName = (chain: string, full?: boolean) => {
  switch (chain) {
    case Chain.Cosmos:
      return 'Cosmos';
    case Chain.THORChain:
      return full ? 'THORChain' : chain;
    case Chain.Avalanche:
      return full ? 'Avalanche' : chain;
    case Chain.Binance:
      return full ? 'BNB Beacon Chain' : chain;
    case Chain.BinanceSmartChain:
      return full ? 'BNB Smart Chain' : chain;
    case Chain.BitcoinCash:
      return full ? 'Bitcoin Cash' : chain;
    case Chain.Bitcoin:
      return full ? 'Bitcoin' : chain;
    case Chain.Ethereum:
      return full ? 'Ethereum' : chain;
    case Chain.Litecoin:
      return full ? 'Litecoin' : chain;
    case Chain.Dogecoin:
      return full ? 'Dogecoin' : chain;
    case Chain.Arbitrum:
      return full ? 'Arbitrum' : chain;
    case Chain.Kujira:
      return full ? 'Kujira' : chain;
    case Chain.Maya:
      return full ? 'Mayachain' : chain;
    case Chain.Dash:
      return 'Dash';
    case Chain.Polkadot:
      return full ? 'Polkadot' : chain;

    default:
      return chain;
  }
};
