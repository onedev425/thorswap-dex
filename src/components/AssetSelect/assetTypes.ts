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
    chainAsset: AssetValue.fromChainOrSignature(Chain.THORChain),
  },
  {
    value: "btc",
    label: "BTC",
    tooltip: "Bitcoin (BTC)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Bitcoin),
  },
  {
    value: "erc20",
    label: "ERC20",
    tooltip: "Ethereum Mainnet (ERC-20)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Ethereum),
  },
  {
    value: "arbitrum",
    label: "ARB",
    tooltip: "Arbitrum (ARB)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Arbitrum),
  },
  {
    value: "maya",
    label: "MAYA",
    tooltip: "MAYAChain",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Maya),
  },
  {
    value: "bep20",
    label: "BEP20",
    tooltip: "BNB Smart Chain (BEP20)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.BinanceSmartChain),
  },
  {
    value: "avax",
    label: "ERC20",
    tooltip: "Avalanche C-Chain (ERC-20)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Avalanche),
  },
  {
    value: "doge",
    label: "DOGE",
    tooltip: "Dogecoin",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Dogecoin),
  },
  {
    value: "dot",
    label: "DOT",
    tooltip: "Polkadot",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Polkadot),
  },
  {
    value: "kuji",
    label: "KUJI",
    tooltip: "Kujira",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Kujira),
  },
  {
    value: "bch",
    label: "BCH",
    tooltip: "Bitcoin Cash (BCH)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.BitcoinCash),
  },
  {
    value: "ltc",
    label: "LTC",
    tooltip: "Litecoin (LTC)",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Litecoin),
  },
  {
    value: "dash",
    label: "DASH",
    tooltip: "Dash",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Dash),
  },
  {
    value: "gaia",
    label: "COSMOS",
    tooltip: "Cosmos Gaia",
    chainAsset: AssetValue.fromChainOrSignature(Chain.Cosmos),
  },
];
