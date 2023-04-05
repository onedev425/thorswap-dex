import { Box } from 'components/Atomic';
import { Chart } from 'components/Chart';
import { ChartType } from 'components/Chart/types';
import { memo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

import {
  LiquidityChartIndex,
  liquidityChartIndexes,
  VolumeChartIndex,
  volumeChartIndexes,
} from './types';
import { useGlobalChartInfo } from './useGlobalChartInfo';

export const GlobalChart = memo(() => {
  const [volumeChartIndex, setVolumeChartIndex] = useState<string>(VolumeChartIndex.Total);
  const [liquidityChartIndex, setLiquidityChartIndex] = useState<string>(
    LiquidityChartIndex.Liquidity,
  );
  const { volumeChartData, liquidityChartData } = useGlobalChartInfo();
  const { hideCharts } = useApp();

  if (hideCharts) return null;

  return (
    <Box col className="lg:grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-x-8 w-full box-border">
      <Box className="w-full" flex={1}>
        <Chart
          abbreviateValues
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
