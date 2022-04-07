import { useMemo } from 'react'

import { Amount, Percent } from '@thorswap-lib/multichain-sdk'

import { StatsType } from 'components/Stats'

import { useGlobalState } from 'store/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

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
        tooltip:
          'Total Value Locked amount in the network (Total Liquidity + Total Node Bond)',
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: 'Total Liquidity',
        value: runeToCurrency(
          Amount.fromMidgard(networkData?.totalPooledRune).mul(2),
        ).toCurrencyFormat(2),
        tooltip: 'Total Liquidity Added in all pools',
      },
      {
        iconName: 'chartCandle',
        color: 'pink',
        label: 'Total Active Bond',
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(2)}`,
        tooltip: 'Total Bond Amounts by Active Nodes',
      },
      {
        iconName: 'barchart',
        color: 'blueLight',
        label: 'Total Volume',
        value: runeToCurrency(totalVolume).toCurrencyFormat(2),
        tooltip: 'Total Trade Volume in the network.',
      },
      {
        iconName: 'history',
        color: 'yellow',
        label: '24H Volume',
        value: volume24h
          ? runeToCurrency(Amount.fromMidgard(volume24h || 0)).toCurrencyFormat(
              2,
            )
          : '-',
        tooltip: '24H Volume for Swap, Add, Withdraw',
      },
      {
        iconName: 'percent',
        color: 'purple',
        label: 'Liquidity APY',
        value: liquidityAPYLabel,
        tooltip: 'Average Liquidity APY for all pools',
      },
      {
        iconName: 'chartArea2',
        color: 'pink',
        label: 'Total Pooled RUNE',
        value: `${totalPooledRune.toAbbreviate(
          2,
        )} / ${maxLiquidityRune.toAbbreviate(2)}`,
        tooltip: 'Total Pooled RUNE / Max RUNE Liquidity Cap',
      },
      {
        iconName: 'percent',
        color: 'blueLight',
        label: 'Bonding APY',
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
