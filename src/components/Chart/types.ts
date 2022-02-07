import { ChartData } from 'chart.js'

export type DataPoint = { x: string; y: number }
export enum ChartType {
  Bar = 'bar',
  Area = 'area',
  Line = 'line',
  CurvedLine = 'curved-line',
}

export type ChartDataType = {
  [ChartType.Bar]: ChartData<'bar', DataPoint[], string>
  [ChartType.Area]: ChartData<'line', DataPoint[], string>
  [ChartType.Line]: ChartData<'line', number[], string>
  [ChartType.CurvedLine]: ChartData<'line', number[], string>
}

export type ChartProps = {
  className?: string
  type: ChartType
  data: DataPoint[]
}
