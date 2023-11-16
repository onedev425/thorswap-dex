import { AssetValue, Chain } from '@swapkit/core';
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
  Chain.Litecoin,
];

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Litecoin,
  Chain.Cosmos,
  Chain.BitcoinCash,
  Chain.Dogecoin,
  Chain.Binance,
] as const;

export const SORTED_LENDING_COLLATERAL_ASSETS = [
  AssetValue.fromChainOrSignature(Chain.Bitcoin),
  AssetValue.fromChainOrSignature(Chain.Ethereum),
  AssetValue.fromChainOrSignature(Chain.BinanceSmartChain),
  AssetValue.fromChainOrSignature(Chain.Binance),
  AssetValue.fromChainOrSignature(Chain.Avalanche),
  AssetValue.fromChainOrSignature(Chain.Cosmos),
  AssetValue.fromChainOrSignature(Chain.Dogecoin),
  AssetValue.fromChainOrSignature(Chain.BitcoinCash),
  AssetValue.fromChainOrSignature(Chain.Litecoin),
];
