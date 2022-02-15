import { ChartType, DataPoint } from '../types'
import { getChartData } from './chartData'
import { getChartOptions } from './chartOptions'

const chartConfig = (
  type: ChartType,
  data: DataPoint[],
  hideLabel: boolean,
) => {
  return {
    chartData: getChartData(type, data),
    options: getChartOptions(hideLabel),
  }
}

export default chartConfig
