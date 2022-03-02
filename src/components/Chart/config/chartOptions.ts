import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

export const getChartOptions = (hideLabel: boolean, hasGrid: boolean) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 500,
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
          display: hideLabel ? false : true,
        },
      },
    },
  }
}
