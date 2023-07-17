import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

export const SUPPORTED_CHAINS = [
  Chain.THORChain,
  Chain.Avalanche,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Binance,
  Chain.BinanceSmartChain,
  Chain.Cosmos,
  Chain.Dogecoin,
  Chain.BitcoinCash,
  Chain.Litecoin
];

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Binance,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Dogecoin,
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
  getSignatureAssetFor(Chain.Dogecoin),
  getSignatureAssetFor(Chain.BitcoinCash),
  getSignatureAssetFor(Chain.Litecoin),
];

export const SORTED_LENDING_COLLATERAL_ASSETS = SORTED_EARN_ASSETS;
