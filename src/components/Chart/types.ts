import { ChartData } from 'chart.js'

export type DataPoint = { x: string; y: number }
export enum ChartType {
  Bar = 'bar',
  Area = 'area',
  Line = 'line',
  CurvedLine = 'curvedLine',
}

export type BarChartType = ChartData<ChartType.Bar, DataPoint[], string>
export type AreaChartType = ChartData<ChartType.Line, DataPoint[], string>
export type LineChartType = ChartData<ChartType.Line, number[], string>
export type CurvedLineChartType = ChartData<ChartType.Line, number[], string>

export type ChartProps = {
  className?: string
  type: ChartType
  data: DataPoint[]
  hideLabel?: boolean
  hasGird?: boolean
}
