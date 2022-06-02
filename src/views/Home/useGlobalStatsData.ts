import { useMemo } from 'react'

import { Amount, Percent } from '@thorswap-lib/multichain-sdk'

import { StatsType } from 'components/StatsList/types'

import { useGlobalState } from 'store/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

export const useGlobalStatsData = () => {
  const { runeToCurrency } = useGlobalState()

  const {
    tvlInRune,
    totalActiveBond,
    liquidityAPYLabel,
    totalVolume,
    volume24h,
    networkData,
  } = useGlobalStats()

  const { totalPooledRune, maxLiquidityRune } = useMimir()

  const bondingAPYLabel = new Percent(networkData?.bondingAPY ?? 0).toFixed(2)

  const statsData: StatsType[] = useMemo(() => {
    return [
      {
        iconName: 'lockFill',
        color: 'yellow',
        label: 'TVL',
        value: runeToCurrency(tvlInRune).toCurrencyFormat(2),
        tooltip: t('views.stats.tvlTooltip'),
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: t('views.stats.totalLiq'),
        value: runeToCurrency(
          Amount.fromMidgard(networkData?.totalPooledRune).mul(2),
        ).toCurrencyFormat(2),
        tooltip: t('views.stats.totalLiqTooltip'),
      },
      {
        iconName: 'chartCandle',
        color: 'pink',
        label: t('views.stats.totalBond'),
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(2)}`,
        tooltip: t('views.stats.totalBondTooltip'),
      },
      {
        iconName: 'barchart',
        color: 'blueLight',
        label: t('views.stats.totalVolume'),
        value: runeToCurrency(totalVolume).toCurrencyFormat(2),
        tooltip: t('views.stats.totalVolumeTooltip'),
      },
      {
        iconName: 'history',
        color: 'yellow',
        label: t('views.stats.24Volume'),
        value: volume24h
          ? runeToCurrency(Amount.fromMidgard(volume24h || 0)).toCurrencyFormat(
              2,
            )
          : '-',
        tooltip: t('views.stats.24VolumeTooltip'),
      },
      {
        iconName: 'percent',
        color: 'purple',
        label: t('views.stats.liqAPY'),
        value: liquidityAPYLabel,
        tooltip: t('views.stats.liqAPYTooltip'),
      },
      {
        iconName: 'chartArea2',
        color: 'pink',
        label: t('views.stats.totalRUNE'),
        value: `${totalPooledRune.toAbbreviate(
          2,
        )} / ${maxLiquidityRune.toAbbreviate(2)}`,
        tooltip: t('views.stats.totalRUNETooltip'),
      },
      {
        iconName: 'percent',
        color: 'blueLight',
        label: t('views.stats.bondAPY'),
        value: bondingAPYLabel,
      },
    ]
  }, [
    volume24h,
    liquidityAPYLabel,
    totalVolume,
    maxLiquidityRune,
    totalPooledRune,
    networkData,
    tvlInRune,
    totalActiveBond,
    bondingAPYLabel,
    runeToCurrency,
  ])

  return statsData
}
