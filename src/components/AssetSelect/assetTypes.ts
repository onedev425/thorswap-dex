import { AssetValue, Chain } from '@swapkit/core';

export type AssetFilterOptionType =
  | 'all'
  | 'avax'
  | 'synth'
  | 'native'
  | 'erc20'
  | 'arbitrum'
  | 'bep20';

export type AssetFilterType = {
  value: AssetFilterOptionType;
  label: string;
  tooltip?: string;
  chainAsset?: AssetValue;
};

export const assetFilterTypes: AssetFilterType[] = [
  { value: 'all', label: 'All', tooltip: 'All assets' },
  { value: 'native', label: 'Native', tooltip: 'Native assets' },
  { value: 'synth', label: 'Synth', tooltip: 'THORChain Synthetic Assets' },
  {
    value: 'erc20',
    label: 'ERC20',
    tooltip: 'Ethereum Mainnet (ERC-20)',
    chainAsset: AssetValue.fromChainOrSignature(Chain.Ethereum),
  },
  {
    value: 'avax',
    label: 'ERC20',
    tooltip: 'Avalanche C-Chain (ERC-20)',
    chainAsset: AssetValue.fromChainOrSignature(Chain.Avalanche),
  },
  {
    value: 'arbitrum',
    label: 'ARB',
    tooltip: 'Arbitrum (ARB)',
    chainAsset: AssetValue.fromChainOrSignature(Chain.Arbitrum),
  },
  {
    value: 'bep20',
    label: 'BEP20',
    tooltip: 'BNB Smart Chain (BEP20)',
    chainAsset: AssetValue.fromChainOrSignature(Chain.BinanceSmartChain),
  },
];
