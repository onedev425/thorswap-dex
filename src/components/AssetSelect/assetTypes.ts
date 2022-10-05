export type AssetFilterOptionType = 'all' | 'avax' | 'synth' | 'native' | 'erc20' | 'bep2';

export type AssetFilterType = {
  value: AssetFilterOptionType;
  label: string;
};

export const assetFilterTypes: AssetFilterType[] = [
  { value: 'all', label: 'All' },
  { value: 'synth', label: 'Synth' },
  { value: 'native', label: 'Native' },
  { value: 'erc20', label: 'ERC20' },
  { value: 'avax', label: 'ARC20' },
  { value: 'bep2', label: 'BEP2' },
];
