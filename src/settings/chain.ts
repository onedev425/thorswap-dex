import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Binance,
  Chain.Avalanche,
  Chain.Doge,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Cosmos,
] as const;

export const SORTED_EARN_ASSETS = [
  Asset.BTC(),
  Asset.ETH(),
  Asset.BNB(),
  Asset.AVAX(),
  Asset.ATOM(),
  Asset.DOGE(),
  Asset.BCH(),
  Asset.LTC(),
];
