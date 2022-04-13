import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsGroupProps } from 'components/StatsGroup/types'

import { useGlobalState } from 'store/hooks'
import { useMidgard } from 'store/midgard/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

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
        title: t('views.stats.volume'),
        iconName: 'lightning',
        iconColor: 'pink',
        stats: [
          {
            label: t('views.stats.totalVolume'),
            value: runeToCurrency(totalVolume).toCurrencyFormat(2),
          },
          {
            label: t('views.stats.swapVolume'),
            value: runeToCurrency(
              Amount.fromMidgard(stats?.swapVolume),
            ).toCurrencyFormat(2),
          },
          {
            label: t('views.stats.depositVolume'),
            value: runeToCurrency(
              Amount.fromMidgard(stats?.addLiquidityVolume),
            ).toCurrencyFormat(2),
          },
          {
            label: t('views.stats.withdrawVolume'),
            value: runeToCurrency(
              Amount.fromMidgard(stats?.withdrawVolume),
            ).toCurrencyFormat(2),
          },
        ],
      },
      {
        title: t('common.liquidity'),
        iconName: 'chartArea',
        iconColor: 'blue',
        stats: [
          {
            label: t('views.stats.totalLiq'),
            value: runeToCurrency(
              Amount.fromMidgard(stats?.runeDepth).mul(2),
            ).toCurrencyFormat(2),
          },
          {
            label: t('views.stats.totalRUNE'),
            value: `${Amount.fromMidgard(
              networkData?.totalPooledRune,
            ).toAbbreviate()} RUNE`,
          },
          {
            label: t('views.stats.maxRuneLiq'),
            value: `${maxLiquidityRune?.toAbbreviate() ?? 'N/A'} RUNE`,
          },
          {
            label: t('common.liquidityAPY'),
            value: liquidityAPYLabel,
          },
        ],
      },
      {
        title: t('common.network'),
        iconName: 'fire',
        iconColor: 'purple',
        stats: [
          {
            label: 'TVL',
            value: runeToCurrency(tvlInRune).toCurrencyFormat(2),
            tooltip: t('views.stats.tvlTooltip'),
          },
          {
            label: t('views.stats.upgradedRune'),
            value: `${Amount.fromMidgard(
              stats?.switchedRune,
            ).toAbbreviate()} RUNE`,
          },
          {
            label: t('views.stats.currentBlockHeight'),
            value: Amount.fromNormalAmount(lastBlock?.[0]?.thorchain).toFixed(
              0,
            ),
          },
          {
            label: t('views.nodes.detail.nextChurnHeight'),
            value: Amount.fromNormalAmount(
              networkData?.nextChurnHeight,
            ).toFixed(0),
          },
        ],
      },
      {
        title: t('views.nodes.node'),
        iconName: 'node',
        iconColor: 'green',
        stats: [
          {
            label: t('views.stats.totalBond'),
            value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
              2,
            )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
            tooltip: t('views.stats.totalBondTooltip'),
          },
          {
            label: t('views.nodes.totalBond'),
            value: `${runeToCurrency(totalBond).toCurrencyFormat(
              2,
            )} (${totalBond.toAbbreviate(1)} ᚱ)`,
            tooltip: t('views.nodes.detail.totalBondTooltip'),
          },
          {
            label: t('views.nodes.detail.bondingAPY'),
            value: bondingAPYLabel,
          },
          {
            label: t('views.nodes.detail.activeNodeCount'),
            value: Amount.fromNormalAmount(
              networkData?.activeNodeCount,
            ).toFixed(0),
          },
        ],
      },
      {
        title: t('views.stats.blockRewards'),
        iconName: 'chartPie',
        iconColor: 'orange',
        stats: [
          {
            label: t('views.stats.totalReserve'),
            value: runeToCurrency(
              Amount.fromMidgard(networkData?.totalReserve),
            ).toCurrencyFormat(2),
          },
          {
            label: t('views.stats.dailyBlockRewards'),
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.blockReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
          {
            label: t('views.stats.dailyLpRewards'),
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.poolReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
          {
            label: t('views.nodes.detail.dailyBondRewards'),
            value: `${runeToCurrency(
              Amount.fromMidgard(networkData?.blockRewards?.bondReward).mul(
                14400,
              ),
            ).toCurrencyFormat(2)} `,
          },
        ],
      },
      {
        title: t('views.stats.usage'),
        iconName: 'history',
        iconColor: 'cyan',
        stats: [
          {
            label: t('views.stats.totalTx'),
            value: totalTx.toFixed(),
          },
          {
            label: t('views.stats.swapCount24H'),
            value: Amount.fromNormalAmount(stats?.swapCount24h).toFixed(0),
          },
          {
            label: t('views.stats.monthlyActiveUsers'),
            value: Amount.fromNormalAmount(stats?.monthlyActiveUsers).toFixed(
              0,
            ),
          },
          {
            label: t('views.stats.dailyActiveUsers'),
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
