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
import { getChartData } from 'components/Chart/config/chartData'
import { getChartOptions } from 'components/Chart/config/chartOptions'

import {
  ChartProps,
  ChartType,
  BarChartType,
  AreaChartType,
  LineChartType,
  CurvedLineChartType,
} from './types'

export const Chart = ({
  className,
  type,
  data,
  hideLabel = false,
  hasGird = false,
}: ChartProps) => {
  const chartData = getChartData(type, data)
  const options = getChartOptions(hideLabel, hasGird)

  const renderChart = () => {
    switch (type) {
      case ChartType.Bar:
        return <Bar options={options} data={chartData as BarChartType} />
      case ChartType.Area:
        return <Line options={options} data={chartData as AreaChartType} />
      case ChartType.Line:
        return <Line options={options} data={chartData as LineChartType} />
      case ChartType.CurvedLine:
        return (
          <Line options={options} data={chartData as CurvedLineChartType} />
        )
    }
  }

  return (
    <Box className={classNames('w-full h-full', className)}>
      {chartData.datasets.length > 0 ? renderChart() : null}
    </Box>
  )
}
