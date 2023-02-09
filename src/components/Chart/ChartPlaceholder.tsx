import { Text } from '@chakra-ui/react';
import { Box, Icon } from 'components/Atomic';
import { memo, useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { ThemeType } from 'types/app';

import { getChartData } from './config/chartData';
import { getChartOptions } from './config/chartOptions';
import { getRandomChartData } from './config/utils';
import { BarChartType, ChartType, LineChartType } from './types';

type Props = {
  previewChartType: ChartType;
  options: ReturnType<typeof getChartOptions>;
};

const randomData = getRandomChartData();

export const ChartPlaceholder = memo(({ previewChartType, options }: Props) => {
  const { themeType } = useApp();

  const randomSeries = useMemo(
    () =>
      getChartData(
        previewChartType,
        randomData.labels,
        randomData.values,
        themeType === ThemeType.Light || true,
      ),
    [previewChartType, themeType],
  );

  return (
    <>
      <Box className="w-full h-full">
        {previewChartType === ChartType.Bar ? (
          <Bar data={randomSeries as BarChartType} options={options} />
        ) : (
          <Line data={randomSeries as LineChartType} options={options} />
        )}
      </Box>

      <Box center col className="absolute w-full h-full backdrop-blur-sm">
        <Icon spin color="primary" name="refresh" size={16} />
        <Text className="mt-2">{t('common.loading')}</Text>
      </Box>
    </>
  );
});
