import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsType } from 'components/Stats/types'
import { StatsList } from 'components/StatsList'

import { useGlobalState } from 'store/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'

export const NodeStats = () => {
  const { runeToCurrency } = useGlobalState()

  const {
    networkData,
    totalBond,
    totalActiveBond,
    totalStandbyBond,
    bondingAPYLabel,
  } = useGlobalStats()

  const statsData: StatsType[] = useMemo(
    () => [
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Total Bond',
        value: `${runeToCurrency(totalBond).toCurrencyFormat(
          2,
        )} (${totalBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Active, Standby Nodes',
      },
      {
        iconName: 'lightning',
        color: 'pink',
        label: 'Active Bond',
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
          2,
        )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Active Nodes',
      },
      {
        iconName: 'wifi',
        color: 'red',
        label: 'Standbye Bond',
        value: `${runeToCurrency(totalStandbyBond).toCurrencyFormat(
          2,
        )} (${totalStandbyBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Standby Nodes',
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: 'Bonding APY',
        value: bondingAPYLabel,
      },
      {
        iconName: 'chartArea2',
        color: 'green',
        label: 'Daily Bond Rewards',
        value: `${runeToCurrency(
          Amount.fromMidgard(networkData?.blockRewards?.bondReward).mul(14400),
        ).toCurrencyFormat(2)} `,
      },
      {
        iconName: 'fire',
        color: 'blueLight',
        label: 'Next Churn Height',
        value: Amount.fromNormalAmount(networkData?.nextChurnHeight).toFixed(0),
      },
    ],
    [
      runeToCurrency,
      totalBond,
      totalActiveBond,
      totalStandbyBond,
      bondingAPYLabel,
      networkData,
    ],
  )

  return <StatsList list={statsData} scrollable itemWidth={265} />
}
