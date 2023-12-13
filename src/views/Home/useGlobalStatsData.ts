import { SwapKitNumber } from '@swapkit/core';
import type { StatsType } from 'components/StatsList/types';
import { parseToPercent } from 'helpers/parseHelpers';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useMimir } from 'hooks/useMimir';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import {
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetNetworkQuery,
} from 'store/midgard/api';
import { parseBaseValueToNumber } from 'views/Home/GlobalChart';

export const useGlobalStatsData = () => {
  const runeToCurrency = useRuneToCurrency();
  const { tvlInRune, totalActiveBond, liquidityAPYLabel, totalVolume } = useGlobalStats();

  const { data: networkData } = useGetNetworkQuery();
  const { data: swapsData } = useGetHistorySwapsQuery({ interval: 'day', count: 1 });
  const { data: liquidityData } = useGetHistoryLiquidityChangesQuery({
    count: 1,
    interval: 'day',
  });

  const volume24h = useMemo(() => {
    if (!swapsData || !liquidityData) return '$0';
    const { totalVolumeUsd } = swapsData.intervals[0];

    const totalVolume = parseBaseValueToNumber(totalVolumeUsd);

    return `$${new SwapKitNumber(totalVolume).toAbbreviation()}`;
  }, [liquidityData, swapsData]);

  const { totalPooledRune } = useMimir();

  const bondingAPYLabel = parseToPercent(networkData?.bondingAPY);

  const statsData: StatsType[] = useMemo(
    () => [
      {
        iconName: 'lockFill',
        color: 'yellow',
        label: 'TVL',
        value: runeToCurrency(tvlInRune.getValue('string')),
        tooltip: t('views.stats.tvlTooltip'),
      },
      {
        iconName: 'chartArea',
        color: 'purple',
        label: t('views.stats.totalLiq'),
        value: runeToCurrency(`${(parseInt(networkData?.totalPooledRune || '0') / 1e8) * 2}`),
        tooltip: t('views.stats.totalLiqTooltip'),
      },
      {
        iconName: 'chartCandle',
        color: 'pink',
        label: t('views.stats.totalBond'),
        value: runeToCurrency(totalActiveBond.getValue('string')),
        tooltip: t('views.stats.totalBondTooltip'),
      },
      {
        iconName: 'barchart',
        color: 'blueLight',
        label: t('views.stats.totalVolume'),
        value: `$${new SwapKitNumber(totalVolume).toAbbreviation()}`,
        tooltip: t('views.stats.totalVolumeTooltip'),
      },
      {
        iconName: 'history',
        color: 'yellow',
        label: t('views.stats.24Volume'),
        value: volume24h,
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
        value: `${totalPooledRune.toAbbreviation(1)} / ${totalActiveBond.toAbbreviation(1)}`,
        tooltip: t('views.stats.totalRUNETooltip'),
      },
      {
        iconName: 'percent',
        color: 'blueLight',
        label: t('views.stats.bondAPY'),
        value: bondingAPYLabel,
      },
    ],
    [
      volume24h,
      liquidityAPYLabel,
      totalVolume,
      totalActiveBond,
      totalPooledRune,
      networkData,
      tvlInRune,
      bondingAPYLabel,
      runeToCurrency,
    ],
  );

  return statsData;
};
