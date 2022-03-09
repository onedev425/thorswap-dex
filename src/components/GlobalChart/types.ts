import { t } from 'services/i18n'

export enum VolumeChartIndex {
  Total = 'Total',
  Swap = 'Swap',
  Add = 'Add',
  Withdraw = 'Withdraw',
}

export enum LiquidityChartIndex {
  Liquidity = 'Liquidity',
  LpEarning = 'Lp Earning',
  BondEarning = 'Bond Earning',
  RunePrice = '$Rune Price',
}

export const volumeChartMap: Record<VolumeChartIndex, string> = {
  [VolumeChartIndex.Total]: t('views.home.chart.total'),
  [VolumeChartIndex.Swap]: t('views.home.chart.swap'),
  [VolumeChartIndex.Add]: t('views.home.chart.add'),
  [VolumeChartIndex.Withdraw]: t('views.home.chart.withdraw'),
}

export const liquidityChartMap: Record<LiquidityChartIndex, string> = {
  [LiquidityChartIndex.Liquidity]: t('views.home.chart.liquidity'),
  [LiquidityChartIndex.LpEarning]: t('views.home.chart.lpEarning'),
  [LiquidityChartIndex.BondEarning]: t('views.home.chart.bondEarning'),
  [LiquidityChartIndex.RunePrice]: t('views.home.chart.runePrice'),
}

export const volumeChartIndexes = [
  t('views.home.chart.total'),
  t('views.home.chart.swap'),
  t('views.home.chart.add'),
  t('views.home.chart.withdraw'),
]

export const liquidityChartIndexes = [
  t('views.home.chart.liquidity'),
  t('views.home.chart.lpEarning'),
  t('views.home.chart.bondEarning'),
]
