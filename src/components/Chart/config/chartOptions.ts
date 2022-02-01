import * as styles from 'components/Chart/styles/styles'
import { ChartType } from 'components/Chart/types'

const getBarChartOptions = () => {
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
}
const getAreaChartOptions = () => {
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
}
const getLineChartOptions = () => {
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
          display: false,
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
          display: false,
        },
      },
    },
  }
}
const getCurvedLineChartOptions = () => {
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
          display: false,
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
          display: false,
        },
      },
    },
  }
}

export const getChartOptions = (type: ChartType) => {
  switch (type) {
    case 'bar':
      return getBarChartOptions()
    case 'area':
      return getAreaChartOptions()
    case 'line':
      return getLineChartOptions()
    case 'curved-line':
      return getCurvedLineChartOptions()
    default:
      return null
  }
}
