import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StatsType } from 'components/Stats/types'
import { StatsList } from 'components/StatsList'

import { useGlobalState } from 'store/hooks'

import { useGlobalStats } from 'hooks/useGlobalStats'

import { t } from 'services/i18n'

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
        label: t('views.nodes.totalBond'),
        value: `${runeToCurrency(totalBond).toCurrencyFormat(
          2,
        )} (${totalBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.totalBond'),
      },
      {
        iconName: 'lightning',
        color: 'pink',
        label: t('views.nodes.detail.activeBond'),
        value: `${runeToCurrency(totalActiveBond).toCurrencyFormat(
          2,
        )} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.activeBondTooltip'),
      },
      {
        iconName: 'wifi',
        color: 'red',
        label: t('views.nodes.detail.standbyeBond'),
        value: `${runeToCurrency(totalStandbyBond).toCurrencyFormat(
          2,
        )} (${totalStandbyBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.standbyeBondTooltip'),
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: t('views.nodes.detail.bondingAPY'),
        value: bondingAPYLabel,
      },
      {
        iconName: 'chartArea2',
        color: 'green',
        label: t('views.nodes.detail.dailyBondRewards'),
        value: `${runeToCurrency(
          Amount.fromMidgard(networkData?.blockRewards?.bondReward).mul(14400),
        ).toCurrencyFormat(2)} `,
      },
      {
        iconName: 'fire',
        color: 'blueLight',
        label: t('views.nodes.detail.nextChurnHeight'),
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
