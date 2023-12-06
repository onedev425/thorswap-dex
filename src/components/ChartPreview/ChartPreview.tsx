import { Box } from '@chakra-ui/react';
import classNames from 'classnames';
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import { getDataForCurvedLineChart } from './config/chartData';
import { getChartOptions } from './config/chartOptions';

type ChartProps = {
  className?: string;
  labels: string[];
  values: number[];
  hideLabel?: boolean;
  hasGrid?: boolean;
  onHover?: (index: number) => void;
  hoveredIndex?: number | null;
  hideTooltip?: boolean;
  hideAxisLines?: boolean;
};

export const ChartPreview = memo(
  ({
    className,
    labels,
    values,
    hideLabel = false,
    hasGrid = false,
    onHover,
    hoveredIndex,
    hideTooltip,
    hideAxisLines,
  }: ChartProps) => {
    const { chartData, options } = useMemo(
      () => ({
        chartData: getDataForCurvedLineChart(labels, values),
        options: getChartOptions(
          hideLabel,
          hasGrid,
          hideAxisLines,
          onHover,
          hoveredIndex,
          hideTooltip,
        ),
      }),
      [hasGrid, hideLabel, labels, values, onHover, hoveredIndex, hideTooltip, hideAxisLines],
    );

    return (
      <Box className={classNames('flex-1 w-full h-full relative', className)}>
        {/* @ts-expect-error */}
        <Line data={chartData} options={options} />
      </Box>
    );
  },
);
