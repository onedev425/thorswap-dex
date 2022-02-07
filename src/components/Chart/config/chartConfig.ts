import { ChartType, DataPoint } from '../types'
import { getChartData } from './chartData'
import { getChartOptions } from './chartOptions'

const chartConfig = (type: ChartType, data: DataPoint[]) => {
  return {
    chartData: getChartData(type, data),
    options: getChartOptions(),
  }
}

export default chartConfig
