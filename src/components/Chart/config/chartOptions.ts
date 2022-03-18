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
      tooltip: {
        titleFont: {
          size: 20,
        },
        titleSpacing: 20,
        titleMarginBottom: 20,
        padding: 16,
        bodyFont: {
          size: 16,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        boxPadding: 5,

        width: 500,
        caretSize: 10,
        cornerRadius: 15,
        bodySpacing: 10,
        footerMarginTop: 10,
        borderWidth: 5,
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
