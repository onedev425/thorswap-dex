import { IS_SYNTH_ACTIVE } from 'settings/config'

export type AssetFilterOptionType =
  | 'all'
  | 'synth'
  | 'native'
  | 'erc20'
  | 'bep2'

export type AssetFilterType = {
  value: AssetFilterOptionType
  label: string
}

export const assetFilterTypes1: AssetFilterType[] = [
  { value: 'all', label: 'All' },
  { value: 'synth', label: 'Synth' },
  { value: 'native', label: 'Native' },
  { value: 'erc20', label: 'ERC20' },
  { value: 'bep2', label: 'BEP2' },
]

// without synth
export const assetFilterTypes2: AssetFilterType[] = [
  { value: 'all', label: 'All' },
  { value: 'native', label: 'Native' },
  { value: 'erc20', label: 'ERC20' },
  { value: 'bep2', label: 'BEP2' },
]

export const assetFilterTypes: AssetFilterType[] = IS_SYNTH_ACTIVE
  ? assetFilterTypes1
  : assetFilterTypes2
