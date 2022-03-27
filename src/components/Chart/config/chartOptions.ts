import { TooltipCallbacks } from 'chart.js'

import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

import { abbreviateNumber } from 'helpers/number'

const parseTooltipLabel =
  (unit: string): TooltipCallbacks<'line' | 'bar'>['label'] =>
  ({ formattedValue }) =>
    `${unit}${formattedValue}`

export const getChartOptions = (
  hideLabel: boolean,
  hasGrid: boolean,
  unit = '$',
) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
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
        callbacks: { label: parseTooltipLabel(unit) },
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
  }
}
