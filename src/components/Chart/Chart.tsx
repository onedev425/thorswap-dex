import { Bar, Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  ArcElement,
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
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js'
import classNames from 'classnames'

ChartJS.register(
  ArcElement,
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
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
)

import { Box } from 'components/Atomic'

import chartConfig from './config/chartConfig'
import { ChartDataType, ChartProps, ChartType } from './types'

export const Chart = ({
  className,
  type,
  data,
  hideLabel = false,
}: ChartProps) => {
  const { options, chartData } = chartConfig(type, data, hideLabel)

  const renderChart = () => {
    if (!chartData) {
      return null
    }

    switch (type) {
      case 'bar':
        return (
          <Bar
            options={options}
            data={chartData as ChartDataType[ChartType.Bar]}
          />
        )
      case 'area':
        return (
          <Line
            options={options}
            data={chartData as ChartDataType[ChartType.Area]}
          />
        )
      case 'line':
        return (
          <Line
            options={options}
            data={chartData as ChartDataType[ChartType.Line]}
          />
        )
      case 'curved-line':
        return (
          <Line
            options={options}
            data={chartData as ChartDataType[ChartType.CurvedLine]}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <Box className={classNames('w-full h-full', className)}>
      {renderChart()}
    </Box>
  )
}
