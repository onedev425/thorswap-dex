import { TooltipCallbacks } from 'chart.js'

import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

import { abbreviateNumber } from 'helpers/number'

type Params = {
  hideLabel: boolean
  hasGrid: boolean
  unit?: string
  formatter?: (value: number) => string
}

const parseTooltipLabel =
  (
    unit: string,
    formatter?: (value: number) => string,
  ): TooltipCallbacks<'line' | 'bar'>['label'] =>
  ({ formattedValue }) =>
    formatter
      ? formatter(parseFloat(`${formattedValue}`.replace(/[^0-9.]/g, '')))
      : `${unit}${formattedValue}`

export const getChartOptions = ({
  formatter,
  hideLabel,
  hasGrid,
  unit = '$',
}: Params) =>
  ({
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 1000,
    interaction: {
      intersect: false,
      mode: 'nearest' as const,
      axis: 'xy' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        bodyFont: { size: 16 },
        bodySpacing: 10,
        borderWidth: 5,
        boxPadding: 5,
        caretSize: 10,
        cornerRadius: 15,
        footerMarginTop: 10,
        padding: 16,
        titleFont: { size: 20 },
        titleMarginBottom: 20,
        titleSpacing: 20,
        width: 500,
        callbacks: { label: parseTooltipLabel(unit, formatter) },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: hasGrid,
          drawTicks: false,
          color: gridLinesColor,
        },
        ticks: {
          ...styles.chartXTicksStyles,
          display: hideLabel ? false : true,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: hasGrid,
          drawTicks: false,
          color: gridLinesColor,
        },
        ticks: {
          ...styles.chartYTicksStyles,
          callback: (value: number | string, index: number) => {
            if (index % 2 === 0) return ''

            return typeof value === 'number'
              ? `${unit}${abbreviateNumber(value)}`
              : value
          },
          display: hideLabel ? false : true,
        },
      },
    },
  } as const)
