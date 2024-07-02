import { AssetValue, Chain } from "@swapkit/sdk";
export const SUPPORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Maya,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Arbitrum,
  Chain.Dogecoin,
  Chain.Polkadot,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Cosmos,
  Chain.Dash,
  Chain.Kujira,
];

export const SORTED_CHAINS = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Maya,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Arbitrum,
  Chain.Dogecoin,
  Chain.Polkadot,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Cosmos,
  Chain.Dash,
  Chain.Kujira,
] as Chain[];

export const SORTED_LENDING_COLLATERAL_ASSETS = [
  AssetValue.fromChainOrSignature(Chain.Bitcoin),
  AssetValue.fromChainOrSignature(Chain.Ethereum),
  AssetValue.fromChainOrSignature(Chain.BinanceSmartChain),
  AssetValue.fromChainOrSignature(Chain.Avalanche),
  AssetValue.fromChainOrSignature(Chain.Cosmos),
  AssetValue.fromChainOrSignature(Chain.Dogecoin),
  AssetValue.fromChainOrSignature(Chain.BitcoinCash),
  AssetValue.fromChainOrSignature(Chain.Litecoin),
];
