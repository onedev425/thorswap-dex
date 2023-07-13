import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Binance,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Doge,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Cosmos,
] as const;

export const SORTED_EARN_ASSETS = [
  getSignatureAssetFor(Chain.Bitcoin),
  getSignatureAssetFor(Chain.Ethereum),
  // getSignatureAssetFor(Chain.BinanceSmartChain),
  getSignatureAssetFor(Chain.Binance),
  getSignatureAssetFor(Chain.Avalanche),
  getSignatureAssetFor(Chain.Cosmos),
  getSignatureAssetFor(Chain.Doge),
  getSignatureAssetFor(Chain.BitcoinCash),
  getSignatureAssetFor(Chain.Litecoin),
];

export const SORTED_LENDING_COLLATERAL_ASSETS = SORTED_EARN_ASSETS;
