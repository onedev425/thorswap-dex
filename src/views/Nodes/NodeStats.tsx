import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsType } from 'components/Stats/types'
import { StatsList } from 'components/StatsList'

import { useGlobalState } from 'redux/hooks'

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

  const statsData: StatsType[] = useMemo(() => {
    return [
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
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Active Bond',
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
          2,
        )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Active Nodes',
      },
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Standby Bond',
        value: `${runeToCurrency(totalStandbyBond).toCurrencyFormat(
          2,
        )} (${totalStandbyBond.toAbbreviate(1)} ᚱ)`,
        tooltip: 'Total Bond Amounts by Standby Nodes',
      },
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Bonding APY',
        value: bondingAPYLabel,
      },
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Daily Bond Rewards',
        value: `${runeToCurrency(
          Amount.fromMidgard(networkData?.blockRewards?.bondReward).mul(14400),
        ).toCurrencyFormat(2)} `,
      },
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: 'Next Churn Height',
        value: Amount.fromNormalAmount(networkData?.nextChurnHeight).toFixed(0),
      },
    ]
  }, [
    runeToCurrency,
    totalBond,
    totalActiveBond,
    totalStandbyBond,
    bondingAPYLabel,
    networkData,
  ])

  return <StatsList list={statsData} scrollable />
}
