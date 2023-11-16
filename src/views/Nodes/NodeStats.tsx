import { SwapKitNumber } from '@swapkit/core';
import { StatsList } from 'components/StatsList';
import type { StatsType } from 'components/StatsList/types';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useGetNetworkQuery } from 'store/midgard/api';

export const NodeStats = () => {
  const runeToCurrency = useRuneToCurrency();
  const { data: networkData } = useGetNetworkQuery();
  const { totalBond, totalActiveBond, totalStandbyBond, bondingAPYLabel } = useGlobalStats();

  const statsData: StatsType[] = useMemo(
    () => [
      {
        iconName: 'chartPie',
        color: 'yellow',
        label: t('views.nodes.totalBond'),
        value: `${runeToCurrency(totalBond.getValue('string'))} (${totalBond.toAbbreviation(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.totalBond'),
      },
      {
        iconName: 'lightning',
        color: 'pink',
        label: t('views.nodes.detail.activeBond'),
        value: `${runeToCurrency(
          totalActiveBond.getValue('string'),
        )} (${totalActiveBond.toAbbreviation(1)} ᚱ)`,
        tooltip: t('views.nodes.detail.activeBondTooltip'),
      },
      {
        iconName: 'wifi',
        color: 'red',
        label: t('views.nodes.detail.standbyBond'),
        value: `${runeToCurrency(
          totalStandbyBond.getValue('string'),
        )} (${totalStandbyBond.toAbbreviation(1)} ᚱ)`,
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
          new SwapKitNumber({
            value: networkData?.blockRewards?.bondReward || '0',
            decimal: 8,
          })
            .mul(14400)
            .getValue('string'),
        )} `,
      },
      {
        iconName: 'fire',
        color: 'blueLight',
        label: t('views.nodes.detail.nextChurnHeight'),
        value: new SwapKitNumber(networkData?.nextChurnHeight || 0).getValue('number').toFixed(1),
      },
    ],
    [runeToCurrency, totalBond, totalActiveBond, totalStandbyBond, bondingAPYLabel, networkData],
  );

  return <StatsList scrollable itemWidth={265} list={statsData} />;
};
