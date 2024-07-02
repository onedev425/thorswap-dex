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
  AssetValue.from({ chain: Chain.Bitcoin }),
  AssetValue.from({ chain: Chain.Ethereum }),
  AssetValue.from({ chain: Chain.BinanceSmartChain }),
  AssetValue.from({ chain: Chain.Avalanche }),
  AssetValue.from({ chain: Chain.Cosmos }),
  AssetValue.from({ chain: Chain.Dogecoin }),
  AssetValue.from({ chain: Chain.BitcoinCash }),
  AssetValue.from({ chain: Chain.Litecoin }),
];
