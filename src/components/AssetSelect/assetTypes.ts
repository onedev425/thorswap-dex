import { AssetValue, Chain } from "@swapkit/sdk";

export type AssetFilterOptionType =
  | "all"
  | "arbitrum"
  | "avax"
  | "bch"
  | "bep20"
  | "btc"
  | "dash"
  | "doge"
  | "dot"
  | "erc20"
  | "gaia"
  | "kuji"
  | "ltc"
  | "maya"
  | "thor";
//   | 'native'

export type AssetFilterType = {
  value: AssetFilterOptionType;
  label: string;
  tooltip?: string;
  chainAsset?: AssetValue;
};

export const assetFilterTypes: AssetFilterType[] = [
  { value: "all", label: "All", tooltip: "All assets" },
  //   { value: 'native', label: 'Native', tooltip: 'Native assets' },
  {
    value: "thor",
    label: "THOR",
    tooltip: "THORChain",
    chainAsset: AssetValue.from({ chain: Chain.THORChain }),
  },
  {
    value: "btc",
    label: "BTC",
    tooltip: "Bitcoin (BTC)",
    chainAsset: AssetValue.from({ chain: Chain.Bitcoin }),
  },
  {
    value: "erc20",
    label: "ERC20",
    tooltip: "Ethereum Mainnet (ERC-20)",
    chainAsset: AssetValue.from({ chain: Chain.Ethereum }),
  },
  {
    value: "arbitrum",
    label: "ARB",
    tooltip: "Arbitrum (ARB)",
    chainAsset: AssetValue.from({ chain: Chain.Arbitrum }),
  },
  {
    value: "maya",
    label: "MAYA",
    tooltip: "MAYAChain",
    chainAsset: AssetValue.from({ chain: Chain.Maya }),
  },
  {
    value: "bep20",
    label: "BEP20",
    tooltip: "BNB Smart Chain (BEP20)",
    chainAsset: AssetValue.from({ chain: Chain.BinanceSmartChain }),
  },
  {
    value: "avax",
    label: "ERC20",
    tooltip: "Avalanche C-Chain (ERC-20)",
    chainAsset: AssetValue.from({ chain: Chain.Avalanche }),
  },
  {
    value: "doge",
    label: "DOGE",
    tooltip: "Dogecoin",
    chainAsset: AssetValue.from({ chain: Chain.Dogecoin }),
  },
  {
    value: "dot",
    label: "DOT",
    tooltip: "Polkadot",
    chainAsset: AssetValue.from({ chain: Chain.Polkadot }),
  },
  {
    value: "kuji",
    label: "KUJI",
    tooltip: "Kujira",
    chainAsset: AssetValue.from({ chain: Chain.Kujira }),
  },
  {
    value: "bch",
    label: "BCH",
    tooltip: "Bitcoin Cash (BCH)",
    chainAsset: AssetValue.from({ chain: Chain.BitcoinCash }),
  },
  {
    value: "ltc",
    label: "LTC",
    tooltip: "Litecoin (LTC)",
    chainAsset: AssetValue.from({ chain: Chain.Litecoin }),
  },
  {
    value: "dash",
    label: "DASH",
    tooltip: "Dash",
    chainAsset: AssetValue.from({ chain: Chain.Dash }),
  },
  {
    value: "gaia",
    label: "COSMOS",
    tooltip: "Cosmos Gaia",
    chainAsset: AssetValue.from({ chain: Chain.Cosmos }),
  },
];
