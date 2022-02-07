import * as styles from 'components/Chart/styles/styles'

const DEFAULT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 500,
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
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: styles.chartXTicksStyles,
    },
    y: {
      grid: {
        display: true,
        drawBorder: false,
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: styles.chartYTicksStyles,
    },
  },
}

export const getChartOptions = () => {
  return DEFAULT_OPTIONS
}
