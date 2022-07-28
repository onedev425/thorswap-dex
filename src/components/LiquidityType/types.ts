import { Asset } from '@thorswap-lib/multichain-sdk'

export enum LiquidityTypeOption {
  'RUNE' = 'RUNE',
  'ASSET' = 'ASSET',
  'SYMMETRICAL' = 'SYMMETRICAL',
}

export type LiquidityTypeProps = {
  poolAsset: Asset
  onChange: (val: LiquidityTypeOption) => void
  selected: LiquidityTypeOption
  options: LiquidityTypeOption[]
  title?: string
  tabsCount?: number
}
