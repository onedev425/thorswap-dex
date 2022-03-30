export enum LiquidityTypeOption {
  'RUNE' = 'RUNE',
  'ASSET' = 'ASSET',
  'SYMMETRICAL' = 'SYMMETRICAL',
}

export type LiquidityTypeProps = {
  assetName: string
  onChange: (val: LiquidityTypeOption) => void
  selected: LiquidityTypeOption
}
