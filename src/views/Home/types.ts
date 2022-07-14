export enum PoolTypeOption {
  All = 'All',
  Native = 'Native',
  ERC20 = 'ERC20',
  BEP2 = 'BEP2',
}

export const poolTypeOptions = [
  PoolTypeOption.All,
  PoolTypeOption.Native,
  PoolTypeOption.ERC20,
  PoolTypeOption.BEP2,
]

export const poolStatusOptions = ['Available', 'Staged']

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
