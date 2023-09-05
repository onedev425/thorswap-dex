import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

export type AssetFilterOptionType =
  | 'all'
  | 'avax'
  | 'synth'
  | 'native'
  | 'erc20'
  | 'bep2'
  | 'bep20';

export type AssetFilterType = {
  value: AssetFilterOptionType;
  label: string;
  tooltip?: string;
  chainAsset?: AssetEntity;
};

export const assetFilterTypes: AssetFilterType[] = [
  { value: 'all', label: 'All', tooltip: 'All assets' },
  { value: 'native', label: 'Native', tooltip: 'Native assets' },
  { value: 'synth', label: 'Synth', tooltip: 'THORChain Synthetic Assets' },
  {
    value: 'erc20',
    label: 'ERC20',
    tooltip: 'Ethereum Mainnet (ERC-20)',
    chainAsset: getSignatureAssetFor(Chain.Ethereum),
  },
  {
    value: 'avax',
    label: 'ERC20',
    tooltip: 'Avalanche C-Chain (ERC-20)',
    chainAsset: getSignatureAssetFor(Chain.Avalanche),
  },
  {
    value: 'bep2',
    label: 'BEP2',
    tooltip: 'BNB Beacon Chain (BEP2)',
    chainAsset: getSignatureAssetFor(Chain.Binance),
  },
  {
    value: 'bep20',
    label: 'BEP20',
    tooltip: 'Binance Smart Chain (BEP20)',
    chainAsset: getSignatureAssetFor(Chain.BinanceSmartChain),
  },
];
