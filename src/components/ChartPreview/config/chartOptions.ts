import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

export const getChartOptions = (hideLabel: boolean, hasGrid: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 1000,
  options: {
    parsing: false,
    spanGaps: true,
  },
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
})
