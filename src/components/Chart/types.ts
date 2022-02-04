export type DataPoint = { x: string; y: number }
export type ChartType = 'bar' | 'area' | 'line' | 'curved-line'

export type ChartProps = {
  className?: string
  type: ChartType
  data: DataPoint[]
}
