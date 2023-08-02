import { Amount } from '@thorswap-lib/swapkit-core';
import { StatsType } from 'components/StatsList/types';
import { parseToPercent } from 'helpers/parseHelpers';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useMimir } from 'hooks/useMimir';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useMemo } from 'react';
import { t } from 'services/i18n';

export const useGlobalStatsData = () => {
  const runeToCurrency = useRuneToCurrency();
  const { tvlInRune, totalActiveBond, liquidityAPYLabel, totalVolume, volume24h, networkData } =
    useGlobalStats();

  const { totalPooledRune } = useMimir();

  const bondingAPYLabel = parseToPercent(networkData?.bondingAPY);

  const statsData: StatsType[] = useMemo(() => {
    return [
      {
        iconName: 'lockFill',
        color: 'yellow',
        label: 'TVL',
        value: runeToCurrency(tvlInRune),
        tooltip: t('views.stats.tvlTooltip'),
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: t('views.stats.totalLiq'),
        value: runeToCurrency(Amount.fromMidgard(networkData?.totalPooledRune).mul(2)),
        tooltip: t('views.stats.totalLiqTooltip'),
      },
      {
        iconName: 'chartCandle',
        color: 'pink',
        label: t('views.stats.totalBond'),
        value: `${runeToCurrency(totalActiveBond)}`,
        tooltip: t('views.stats.totalBondTooltip'),
      },
      {
        iconName: 'barchart',
        color: 'blueLight',
        label: t('views.stats.totalVolume'),
        value: runeToCurrency(totalVolume),
        tooltip: t('views.stats.totalVolumeTooltip'),
      },
      {
        iconName: 'history',
        color: 'yellow',
        label: t('views.stats.24Volume'),
        value: volume24h ? runeToCurrency(Amount.fromMidgard(volume24h || 0)) : '-',
        tooltip: t('views.stats.24VolumeTooltip'),
      },
      {
        iconName: 'percent',
        color: 'purple',
        label: t('views.stats.liqAPY'),
        value: liquidityAPYLabel,
        tooltip: t('views.stats.liqAPYTooltip'),
      },
      {
        iconName: 'chartArea2',
        color: 'pink',
        label: t('views.stats.totalRUNE'),
        value: `${totalPooledRune.toAbbreviate(1)} / ${totalActiveBond.toAbbreviate(1)}`,
        tooltip: t('views.stats.totalRUNETooltip'),
      },
      {
        iconName: 'percent',
        color: 'blueLight',
        label: t('views.stats.bondAPY'),
        value: bondingAPYLabel,
      },
    ];
  }, [
    volume24h,
    liquidityAPYLabel,
    totalVolume,
    totalActiveBond,
    totalPooledRune,
    networkData,
    tvlInRune,
    bondingAPYLabel,
    runeToCurrency,
  ]);

  return statsData;
};
