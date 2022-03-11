export enum LiquidityTypeOption {
  Rune = 'rune',
  Asset = 'asset',
  Symmetrical = 'symmetrical',
}

export type LiquidityTypeProps = {
  assetName: string
  onChange: (val: LiquidityTypeOption) => void
  selected: LiquidityTypeOption
}
