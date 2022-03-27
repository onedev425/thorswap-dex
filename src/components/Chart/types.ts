import { ChartData as ReactChartData } from 'chart.js'

import { t } from 'services/i18n'

export type ChartDetail = { value: string; time: number }

export type DataPoint = { x: string; y: number }

export type ChartValues = ChartDetail[]

export enum ChartType {
  Bar = 'bar',
  Area = 'area',
  Line = 'line',
  CurvedLine = 'curvedLine',
}

export type BarChartType = ReactChartData<ChartType.Bar, DataPoint[], string>
export type AreaChartType = ReactChartData<ChartType.Line, DataPoint[], string>
export type LineChartType = ReactChartData<ChartType.Line, number[], string>
export type CurvedLineChartType = ReactChartData<
  ChartType.Line,
  number[],
  string
>

export type ChartObject = {
  values?: ChartValues
  loading?: boolean
  type?: ChartType
  unit?: string
}

export type ChartData = {
  [key: string]: ChartObject
}

export enum ChartTimeFrame {
  Week = 0,
  AllTime = 1,
}

export const chartTimeFrames = [
  t('components.chart.week'),
  t('components.chart.all'),
]

export type ChartProps = {
  className?: string
  title: string
  chartData: ChartData
  chartIndexes: string[]
  selectedIndex: string
  previewChartType?: ChartType
  hideLabel?: boolean
  hasGrid?: boolean
  selectChart: (value: string) => void
}
