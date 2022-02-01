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

import chartConfig from './config/chartConfig'
import { ChartProps } from './types'

export const Chart = (props: ChartProps) => {
  const { type, data } = props
  const { options, chartData } = chartConfig(type, data) as FixMe

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar options={options} data={chartData} />
      case 'area':
      case 'line':
      case 'curved-line':
        return <Line options={options} data={chartData} />
      default:
        return <></>
    }
  }

  return <div className="w-full">{renderChart()}</div>
}
