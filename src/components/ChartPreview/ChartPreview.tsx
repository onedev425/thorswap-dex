import { memo, useMemo } from 'react'

import { Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js'
import classNames from 'classnames'

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Title,
  Tooltip,
  SubTitle,
)

import { Box } from 'components/Atomic'

import { getChartData } from './config/chartData'
import { getChartOptions } from './config/chartOptions'
import { ChartProps } from './types'

export const ChartPreview = memo(
  ({ className, data, hideLabel = false, hasGird = false }: ChartProps) => {
    const { chartData, options } = useMemo(
      () => ({
        chartData: getChartData(data),
        options: getChartOptions(hideLabel, hasGird),
      }),
      [data, hasGird, hideLabel],
    )

    return (
      <Box className={classNames('w-full h-full', className)}>
        <Line options={options} data={chartData} />
      </Box>
    )
  },
)
