import { AssetEntity } from '@thorswap-lib/swapkit-core';

export type AssetFilterOptionType = 'all' | 'avax' | 'synth' | 'native' | 'erc20' | 'bep2';

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
    chainAsset: AssetEntity.ETH(),
  },
  {
    value: 'avax',
    label: 'ERC20',
    tooltip: 'Avalanche C-Chain (ERC-20)',
    chainAsset: AssetEntity.AVAX(),
  },
  {
    value: 'bep2',
    label: 'BEP2',
    tooltip: 'BNB Beacon Chain (BEP2)',
    chainAsset: AssetEntity.BNB(),
  },
];
