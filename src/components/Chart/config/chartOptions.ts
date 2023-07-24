import { TooltipCallbacks } from 'chart.js';
import * as styles from 'components/Chart/styles/styles';

type Params = {
  animated?: boolean;
  hideLabel: boolean;
  hasGrid: boolean;
  unit?: string;
  formatter?: (value: number) => string;
};

const parseTooltipLabel =
  (
    unit: string,
    formatter?: (value: number) => string,
  ): TooltipCallbacks<'line' | 'bar'>['label'] =>
  ({ formattedValue }) =>
    formatter
      ? formatter(parseFloat(`${formattedValue}`.replace(/[^0-9.]/g, '')))
      : `${unit}${formattedValue}`;

export const getChartOptions = ({ formatter, hideLabel, hasGrid, unit = '$' }: Params) =>
  ({
    animation: false,
    maintainAspectRatio: false,
    resizeDelay: 1000,
    responsive: true,
    normalized: true,
    interaction: {
      intersect: false,
      axis: 'x' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        bodyFont: { size: 16 },
        bodySpacing: 10,
        borderWidth: 0,
        boxPadding: 5,
        caretSize: 14,
        cornerRadius: 16,
        footerMarginTop: 10,
        padding: 24,
        titleFont: { size: 18 },
        titleMarginBottom: 16,
        titleSpacing: 8,
        width: 400,
        callbacks: { label: parseTooltipLabel(unit) },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawOnChartArea: hasGrid, drawTicks: false },
        ticks: { ...styles.chartXTicksStyles, display: hideLabel ? false : true },
      },
      y: {
        grid: { display: false, drawOnChartArea: hasGrid, drawTicks: false },
        ticks: {
          ...styles.chartYTicksStyles,
          callback: (value: number | string, index: number) => {
            if (index % 2 === 0) return '';

            return typeof value === 'number' ? formatter?.(value) : value;
          },
          display: hideLabel ? false : true,
        },
      },
    },
  }) as const;
