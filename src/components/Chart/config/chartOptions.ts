import * as styles from 'components/Chart/styles/styles'

export const getChartOptions = (hideLabel: boolean) => {
  return {
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
        ticks: {
          ...styles.chartXTicksStyles,
          display: hideLabel ? false : true,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          ...styles.chartYTicksStyles,
          display: hideLabel ? false : true,
        },
      },
    },
  }
}
