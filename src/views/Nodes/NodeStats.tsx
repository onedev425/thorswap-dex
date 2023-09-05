import { Amount } from '@thorswap-lib/swapkit-core';
import { StatsList } from 'components/StatsList';
import type { StatsType } from 'components/StatsList/types';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useMemo } from 'react';
import { t } from 'services/i18n';

export const NodeStats = () => {
  const runeToCurrency = useRuneToCurrency();

  const { networkData, totalBond, totalActiveBond, totalStandbyBond, bondingAPYLabel } =
    useGlobalStats();

  const statsData: StatsType[] = useMemo(
    () => [
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: t('views.nodes.totalBond'),
        value: `${runeToCurrency(totalBond)} (${totalBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.totalBond'),
      },
      {
        iconName: 'lightning',
        color: 'pink',
        label: t('views.nodes.detail.activeBond'),
        value: `${runeToCurrency(totalActiveBond)} (${totalActiveBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.activeBondTooltip'),
      },
      {
        iconName: 'wifi',
        color: 'red',
        label: t('views.nodes.detail.standbyBond'),
        value: `${runeToCurrency(totalStandbyBond)} (${totalStandbyBond.toAbbreviate(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.standbyBondTooltip'),
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
        )} `,
      },
      {
        iconName: 'fire',
        color: 'blueLight',
        label: t('views.nodes.detail.nextChurnHeight'),
        value: Amount.fromNormalAmount(networkData?.nextChurnHeight).toFixed(1),
      },
    ],
    [runeToCurrency, totalBond, totalActiveBond, totalStandbyBond, bondingAPYLabel, networkData],
  );

  return <StatsList scrollable itemWidth={265} list={statsData} />;
};
