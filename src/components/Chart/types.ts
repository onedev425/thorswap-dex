export type DataPoint = { x: string; y: number }
export type ChartType = 'bar' | 'area' | 'line' | 'curved-line'

export type ChartProps = {
  type: ChartType
  data: DataPoint[]
}
