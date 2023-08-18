export enum PoolCategoryOption {
  Savers = 'Savers',
  All = 'All',
}

export const poolCategoryOptions = [PoolCategoryOption.Savers, PoolCategoryOption.All];
export const poolStatusOptions = ['Available', 'Staged'];

export enum VolumeChartIndex {
  Total = 'total',
  Swap = 'swap',
  Add = 'add',
  Withdraw = 'withdraw',
  Synth = 'synth',
}

export enum ShareChartIndex {
  Total = 'total',
  Earned = 'earned',
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
];

export const sharesChartIndexes = [ShareChartIndex.Earned, ShareChartIndex.Total];

export const liquidityChartIndexes = [
  LiquidityChartIndex.Liquidity,
  LiquidityChartIndex.LpEarning,
  LiquidityChartIndex.BondEarning,
];
