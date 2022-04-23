import { gridLinesColor } from 'components/Chart/styles/colors'
import * as styles from 'components/Chart/styles/styles'

export const getChartOptions = (hideLabel: boolean, hasGrid: boolean) => {
  const gridOptions = {
    color: gridLinesColor,
    display: true,
    drawBorder: false,
    drawOnChartArea: hasGrid,
    drawTicks: false,
  }

  const tickOptions = {
    display: hideLabel ? false : true,
    maxRotation: 0,
    minRotation: 0,
    sampleSize: 1,
  }

  return {
    animation: false,
    maintainAspectRatio: false,
    resizeDelay: 300,
    responsive: true,
    normalized: true,
    interaction: {
      intersect: false,
      mode: 'nearest' as const,
      axis: 'xy' as const,
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: gridOptions,
        ticks: { ...styles.chartXTicksStyles, ...tickOptions },
      },
      y: {
        grid: gridOptions,
        ticks: { ...styles.chartYTicksStyles, ...tickOptions },
      },
    },
  } as const
}
