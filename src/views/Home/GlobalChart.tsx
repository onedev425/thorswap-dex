import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Box } from 'components/Atomic';
import { Chart } from 'components/Chart';
import type { ChartDetail } from 'components/Chart/types';
import { ChartType } from 'components/Chart/types';
import dayjs from 'dayjs';
import { memo, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import {
  useGetHistoryEarningsQuery,
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetHistoryTvlQuery,
} from 'store/midgard/api';

import {
  LiquidityChartIndex,
  liquidityChartIndexes,
  VolumeChartIndex,
  volumeChartIndexes,
} from './types';
import { useGlobalChartInfo } from './useGlobalChartInfo';

const parseBaseValueToNumber = (value: string = '0') => parseInt(value) / 1e8;

export const GlobalChart = memo(() => {
  const { liquidityChartData } = useGlobalChartInfo();
  const { baseCurrency, hideCharts } = useApp();

  const { isLoading: swapGlobalLoading, data: swapGlobalHistory } = useGetHistorySwapsQuery();
  const { isLoading: liquidityLoading, data: liquidityHistory } =
    useGetHistoryLiquidityChangesQuery();
  const { isLoading: earningsLoading, data: earningsHistory } = useGetHistoryEarningsQuery();
  const { isLoading: tvlLoading, data: tvlHistory } = useGetHistoryTvlQuery();

  const [volumeChartIndex, setVolumeChartIndex] = useState<string>(VolumeChartIndex.Total);
  const [liquidityChartIndex, setLiquidityChartIndex] = useState<string>(
    LiquidityChartIndex.Liquidity,
  );

  const chartValueUnit = useMemo(() => {
    const baseCurrencyAsset = AssetEntity.fromAssetString(baseCurrency);

    if (!baseCurrencyAsset || baseCurrencyAsset?.isRUNE()) return 'ᚱ';
    if (baseCurrencyAsset?.ticker === 'USD') return '$';

    return baseCurrencyAsset.ticker;
  }, [baseCurrency]);

  const volumeChartData = useMemo(() => {
    const swapIntervals = swapGlobalHistory?.intervals || [];
    const liquidityIntervals = liquidityHistory?.intervals;

    const swapVolume: ChartDetail[] = [];
    const lpAddVolume: ChartDetail[] = [];
    const lpWithdrawVolume: ChartDetail[] = [];
    const synthsVolume: ChartDetail[] = [];
    const totalVolume: ChartDetail[] = [];

    swapIntervals.forEach((item, index) => {
      const { addLiquidityVolume, withdrawVolume } = liquidityIntervals?.[index] || {};
      const lpAddValue = parseBaseValueToNumber(addLiquidityVolume);
      const lpWithdrawValue = parseBaseValueToNumber(withdrawVolume);
      const synthValue =
        parseBaseValueToNumber(item.synthMintVolume) +
        parseBaseValueToNumber(item.synthRedeemVolume);
      const totalValue = parseBaseValueToNumber(item.totalVolumeUsd);
      const time = dayjs.unix(parseInt(item.startTime)).format('MMM DD');

      synthsVolume.push({ time, value: synthValue });
      swapVolume.push({ time, value: totalValue });
      lpAddVolume.push({ time, value: lpAddValue });
      lpWithdrawVolume.push({ time, value: lpWithdrawValue });
      totalVolume.push({ time, value: totalValue + lpAddValue + lpWithdrawValue });
    });

    return {
      [VolumeChartIndex.Total]: {
        values: totalVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Swap]: {
        values: swapVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Add]: {
        values: lpAddVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Synth]: {
        values: synthsVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Withdraw]: {
        values: lpWithdrawVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
    };
  }, [chartValueUnit, liquidityHistory?.intervals, swapGlobalHistory?.intervals]);

  if (hideCharts) return null;

  return (
    <Box col className="lg:grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-x-8 w-full box-border">
      <Box className="w-full" flex={1}>
        <Chart
          abbreviateValues
          dataInProgress
          chartData={volumeChartData}
          chartIndexes={volumeChartIndexes}
          selectChart={setVolumeChartIndex}
          selectedIndex={volumeChartIndex}
          title={t('views.home.chart_volume')}
        />
      </Box>

      <Box className="w-full" flex={1}>
        <Chart
          abbreviateValues
          beginAt={0}
          chartData={liquidityChartData}
          chartIndexes={liquidityChartIndexes}
          previewChartType={ChartType.CurvedLine}
          selectChart={setLiquidityChartIndex}
          selectedIndex={liquidityChartIndex}
          title={t('views.home.chart_liquidity')}
        />
      </Box>
    </Box>
  );
});
