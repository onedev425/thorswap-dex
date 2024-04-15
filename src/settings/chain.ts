import { AssetValue, Chain } from '@swapkit/core';
export const SUPPORTED_CHAINS = [
  Chain.THORChain,
  Chain.Avalanche,
  Chain.Arbitrum,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Binance,
  Chain.BinanceSmartChain,
  Chain.Maya,
  Chain.Dash,
  Chain.Kujira,
  Chain.Cosmos,
  Chain.Dogecoin,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Polkadot,
];

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.BinanceSmartChain,
  Chain.Maya,
  Chain.Avalanche,
  Chain.Arbitrum,
  Chain.Litecoin,
  Chain.Cosmos,
  Chain.Polkadot,
  Chain.BitcoinCash,
  Chain.Dogecoin,
  Chain.Binance,
  Chain.Kujira,
  Chain.Dash,
] as Chain[];

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
