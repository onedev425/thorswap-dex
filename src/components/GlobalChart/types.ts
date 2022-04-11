export enum VolumeChartIndex {
  Total = 'total',
  Swap = 'swap',
  Add = 'add',
  Withdraw = 'withdraw',
  Synth = 'synth',
}

export enum LiquidityChartIndex {
  Liquidity = 'liquidity',
  LpEarning = 'lpEarning',
  BondEarning = 'bondEarning',
}

export const volumeChartIndexes = [
  VolumeChartIndex.Total,
  VolumeChartIndex.Swap,
  VolumeChartIndex.Add,
  VolumeChartIndex.Withdraw,
]

export const liquidityChartIndexes = [
  LiquidityChartIndex.Liquidity,
  LiquidityChartIndex.LpEarning,
  LiquidityChartIndex.BondEarning,
]
