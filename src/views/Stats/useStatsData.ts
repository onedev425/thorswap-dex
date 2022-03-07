import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsGroupProps } from 'components/StatsGroup/types'

import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

export const useStatsData = () => {
  const { stats, lastBlock } = useMidgard()
  const { runeToCurrency } = useGlobalState()
  const { maxLiquidityRune } = useMimir()

  const {
    tvlInRune,
    totalActiveBond,
    bondingAPYLabel,
    liquidityAPYLabel,
    totalVolume,
    totalTx,
    totalBond,
    networkData,
  } = useGlobalStats()

  const statsGroupData: StatsGroupProps[] = useMemo(
    () => [
      {
        title: 'Volume',
        iconName: 'lightning',
        iconColor: 'pink',
        stats: [
          {
            label: 'Total Volume',
            value: runeToCurrency(totalVolume).toCurrencyFormat(2),
          },
          {
            label: 'Swap Volume',
            value: runeToCurrency(
              Amount.fromMidgard(stats?.swapVolume),
            ).toCurrencyFormat(2),
          },
          {
            label: 'Deposit Volume',
            value: runeToCurrency(
              Amount.fromMidgard(stats?.addLiquidityVolume),
            ).toCurrencyFormat(2),
          },
          {
            label: 'Withdraw Volume',
            value: runeToCurrency(
              Amount.fromMidgard(stats?.withdrawVolume),
            ).toCurrencyFormat(2),
          },
        ],
      },
      {
        title: 'Liquidity',
        iconName: 'chartArea',
        iconColor: 'blue',
        stats: [
          {
            label: 'Total Liquidity',
            value: runeToCurrency(
              Amount.fromMidgard(stats?.runeDepth).mul(2),
            ).toCurrencyFormat(2),
          },
          {
            label: 'Total Pooled RUNE',
            value: `${Amount.fromMidgard(
              networkData?.totalPooledRune,
            ).toAbbreviate()} RUNE`,
          },
          {
            label: 'Max RUNE Liquidity',
            value: `${maxLiquidityRune?.toAbbreviate() ?? 'N/A'} RUNE`,
          },
          {
            label: 'Liquidity APY',
            value: liquidityAPYLabel,
          },
        ],
      },
      {
        title: 'Network',
        iconName: 'fire',
        iconColor: 'purple',
        stats: [
          {
            label: 'TVL',
            value: runeToCurrency(tvlInRune).toCurrencyFormat(2),
            tooltip:
              'Total Value Locked amount in the network (Total Liquidity + Total Node Bond)',
          },
          {
            label: 'Upgraded RUNE',
            value: `${Amount.fromMidgard(
              stats?.switchedRune,
            ).toAbbreviate()} RUNE`,
          },
          {
            label: 'Current Block Height',
            value: Amount.fromNormalAmount(lastBlock?.[0]?.thorchain).toFixed(
              0,
            ),
          },
          {
            label: 'Next Churn Height',
            value: Amount.fromNormalAmount(
              networkData?.nextChurnHeight,
            ).toFixed(0),
          },
        ],
      },
      {
        title: 'Node',
        iconName: 'node',
        iconColor: 'green',
        stats: [
          {
            label: 'Total Active Bond',
            value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
              2,
            )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
            tooltip: 'Total Bond Amounts by Active Nodes',
          },
          {
            label: 'Total Bond',
            value: `${runeToCurrency(totalBond).toCurrencyFormat(
              2,
            )} (${totalBond.toAbbreviate(1)} ᚱ)`,
            tooltip: 'Total Amount Bonded by Nodes',
          },
          {
            label: 'Bonding APY',
            value: bondingAPYLabel,
          },
          {
            label: 'Active Node Count',
            value: Amount.fromNormalAmount(
              networkData?.activeNodeCount,
            ).toFixed(0),
          },
        ],
      },
      {
        title: 'Block Rewards',
        iconName: 'chartPie',
        iconColor: 'orange',
        stats: [
          {
            label: 'Total Reserve',
            value: runeToCurrency(
              Amount.fromMidgard(networkData?.totalReserve),
            ).toCurrencyFormat(2),
          },
          {
            label: 'Daily Block Rewards',
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.blockReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
          {
            label: 'Daily LP Rewards',
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.poolReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
          {
            label: 'Daily Bond Rewards',
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.bondReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
        ],
      },
      {
        title: 'Usage',
        iconName: 'dashboard',
        iconColor: 'cyan',
        stats: [
          {
            label: 'Total Tx',
            value: totalTx.toFixed(),
          },
          {
            label: 'Swap Count 24H',
            value: Amount.fromNormalAmount(stats?.swapCount24h).toFixed(0),
          },
          {
            label: 'Monthly Active Users',
            value: Amount.fromNormalAmount(stats?.monthlyActiveUsers).toFixed(
              0,
            ),
          },
          {
            label: 'Daily Active Users',
            value: Amount.fromNormalAmount(stats?.dailyActiveUsers).toFixed(0),
          },
        ],
      },
    ],
    [
      runeToCurrency,
      totalVolume,
      stats,
      networkData,
      maxLiquidityRune,
      liquidityAPYLabel,
      tvlInRune,
      lastBlock,
      totalActiveBond,
      totalBond,
      bondingAPYLabel,
      totalTx,
    ],
  )

  return statsGroupData
}
