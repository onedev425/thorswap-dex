import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

import { abbreviateNumber } from 'helpers/number'

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
            if (typeof value === 'number')
              return `${unit}${abbreviateNumber(value)}`
            else return value
          },
          display: hideLabel ? false : true,
        },
      },
    },
  }
}
