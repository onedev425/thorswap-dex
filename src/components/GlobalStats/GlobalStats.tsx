import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsList } from 'components/StatsList'

import { useGlobalState } from 'redux/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

import { StatsType } from '../Stats/types'

export const GlobalStats = () => {
  const { runeToCurrency } = useGlobalState()

  const {
    tvlInRune,
    totalActiveBond,
    liquidityAPYLabel,
    totalVolume,
    volume24h,
    networkData,
  } = useGlobalStats()

  const { totalPooledRune, maxLiquidityRune, capPercent, isFundsCapReached } =
    useMimir()

  const statsData: StatsType[] = useMemo(() => {
    return [
      {
        iconName: 'chartPie',
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
        iconName: 'wifi',
        color: 'red',
        label: 'Total Volume',
        value: runeToCurrency(totalVolume).toCurrencyFormat(2),
        tooltip: 'Total Trade Volume in the network.',
      },
      {
        iconName: 'refresh',
        color: 'blueLight',
        label: '24H Volume',
        value: volume24h
          ? runeToCurrency(Amount.fromMidgard(volume24h || 0)).toCurrencyFormat(
              2,
            )
          : '-',
        tooltip: '24H Volume for Swap, Add, Withdraw)',
      },
      {
        iconName: 'chartArea2',
        color: 'green',
        label: 'Total Pooled RUNE',
        value: `${totalPooledRune.toAbbreviate(
          2,
        )} / ${maxLiquidityRune.toAbbreviate(2)}`,
        tooltip: 'Total Pooled RUNE / Max RUNE Liquidity Cap',
      },
      {
        iconName: 'lightning',
        color: 'pink',
        label: 'Funds Cap Over Limit',
        value: capPercent || '-',
        tooltip: !isFundsCapReached
          ? 'You can provide the liquidity until Funds Cap reaches the limit.'
          : 'Funds Cap reached the limit, Please wait for the next raise moment.',
        status: !isFundsCapReached ? 'primary' : 'warning',
      },
      {
        iconName: 'fire',
        color: 'blueLight',
        label: 'Liquidity APY',
        value: liquidityAPYLabel,
        tooltip: 'Average Liquidity APY for all pools',
      },
      {
        iconName: 'chartCandle',
        color: 'blue',
        label: 'Total Active Bond',
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
          2,
        )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Active Nodes',
      },
    ]
  }, [
    volume24h,
    liquidityAPYLabel,
    totalVolume,
    maxLiquidityRune,
    totalPooledRune,
    capPercent,
    runeToCurrency,
    isFundsCapReached,
    networkData,
    tvlInRune,
    totalActiveBond,
  ])

  return <StatsList list={statsData} scrollable />
}
