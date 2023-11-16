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

export const useGlobalStatsData = () => {
  const runeToCurrency = useRuneToCurrency();
  const { tvlInRune, totalActiveBond, liquidityAPYLabel, totalVolume } = useGlobalStats();

  const { data: networkData } = useGetNetworkQuery();
  const { data: swapsData } = useGetHistorySwapsQuery({ interval: 'hour', count: 24 });
  const { data: liquidityData } = useGetHistoryLiquidityChangesQuery({
    count: 24,
    interval: 'hour',
  });

  const volume24h = useMemo(() => {
    const swapVolume = new SwapKitNumber({
      value: swapsData?.meta?.totalVolumeUsd || '0',
      decimal: 8,
    });
    const addVolume = new SwapKitNumber({
      value: liquidityData?.meta?.addLiquidityVolume || '0',
      decimal: 8,
    });
    const withdrawVolume = new SwapKitNumber({
      value: liquidityData?.meta?.withdrawVolume || '0',
      decimal: 8,
    });

    return swapVolume.add(addVolume).add(withdrawVolume).toAbbreviation();
  }, [
    liquidityData?.meta?.addLiquidityVolume,
    liquidityData?.meta?.withdrawVolume,
    swapsData?.meta?.totalVolumeUsd,
  ]);

  const { totalPooledRune } = useMimir();

  const bondingAPYLabel = parseToPercent(networkData?.bondingAPY);

  const statsData: StatsType[] = useMemo(() => {
    return [
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
        value: runeToCurrency(networkData?.totalPooledRune || '0'),
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
        value: runeToCurrency(totalVolume.getValue('string')),
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
