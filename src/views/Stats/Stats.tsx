import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { Typography } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { StatsGroup } from 'components/StatsGroup'

import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'
import { useMimir } from 'hooks/useMimir'

// import { t } from 'services/i18n'

import { StatsGroupType } from './types'

const Stats = () => {
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

  const statsGroupData: StatsGroupType[] = useMemo(
    () => [
      {
        title: 'Volume',
        statsData: {
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
      },
      {
        title: 'Liquidity',
        statsData: {
          iconName: 'lightning',
          iconColor: 'pink',
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
      },
      {
        title: 'Network',
        statsData: {
          iconName: 'lightning',
          iconColor: 'pink',
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
      },
      {
        title: 'Node',
        statsData: {
          iconName: 'lightning',
          iconColor: 'pink',
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
      },
      {
        title: 'Block Rewards',
        statsData: {
          iconName: 'lightning',
          iconColor: 'pink',
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
      },
      {
        title: 'Usage',
        statsData: {
          iconName: 'lightning',
          iconColor: 'pink',
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
              value: Amount.fromNormalAmount(stats?.dailyActiveUsers).toFixed(
                0,
              ),
            },
          ],
        },
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

  return statsGroupData.map(({ title, statsData }) => (
    <div className="flex flex-wrap" key={title}>
      <Helmet title="Stats" content="Stats" />
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {title}
            </Typography>
          </div>
          <StatsGroup {...statsData} />
        </div>
      </div>
    </div>
  ))
}

export default Stats
