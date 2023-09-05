import classNames from 'classnames';
import { Box, Select } from 'components/Atomic';
import { ChartHeader } from 'components/Chart/ChartHeader';
import { ChartPlaceholder } from 'components/Chart/ChartPlaceholder';
import { ChartTypeSelect } from 'components/Chart/ChartTypeSelect';
import { useChartData } from 'components/Chart/useChartData';
import { memo, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { t } from 'services/i18n';

import type { BarChartType, ChartProps, LineChartType } from './types';
import { ChartTimeFrame, ChartType } from './types';

export const Chart = memo(
  ({
    className,
    title,
    chartIndexes = [],
    chartData,
    selectedIndex,
    hideLabel = false,
    hasGrid = false,
    previewChartType = ChartType.Bar,
    selectChart,
    abbreviateValues,
    beginAt,
    dataInProgress,
  }: ChartProps) => {
    const chartTimeFrames = [t('components.chart.week'), t('components.chart.all')];

    const [chartTimeFrame, setChartTimeFrame] = useState(ChartTimeFrame.AllTime);

    const { isChartLoading, selectedChartType, values, parsedChartData, options } = useChartData({
      chartData,
      chartTimeFrame,
      selectedIndex,
      hasGrid,
      hideLabel,
      abbreviateValues,
      beginAt,
      dataInProgress,
    });

    const chartElement = useMemo(() => {
      if (!parsedChartData?.datasets?.length) return null;

      switch (selectedChartType) {
        case ChartType.Bar:
          return <Bar data={parsedChartData as BarChartType} options={options} />;

        case ChartType.CurvedLine:
        case ChartType.Area:
        case ChartType.Line:
          return <Line data={parsedChartData as LineChartType} options={options} />;
      }
    }, [selectedChartType, options, parsedChartData]);

    return (
      <Box col className={classNames('w-full h-full', className)}>
        <Box alignCenter row justify="between">
          <ChartHeader title={title} values={values} />

          <Select
            activeIndex={chartTimeFrame}
            onChange={setChartTimeFrame}
            options={chartTimeFrames}
          />
        </Box>

        <Box alignCenter>
          <ChartTypeSelect
            chartTypeIndexes={chartIndexes}
            selectChartTypeIndex={selectChart}
            selectedChartTypeIndex={selectedIndex}
          />
        </Box>

        <div className="w-full my-4 border-0 border-b-2 border-solid !border-opacity-25 dark:border-dark-border-primary" />

        <Box
          center={isChartLoading}
          className={classNames('min-h-[280px] max-h-[300px]', {
            relative: isChartLoading,
          })}
        >
          {isChartLoading ? (
            <ChartPlaceholder options={options} previewChartType={previewChartType} />
          ) : (
            chartElement
          )}
        </Box>
      </Box>
    );
  },
);
