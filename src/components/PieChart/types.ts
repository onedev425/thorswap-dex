import { IconColor, IconName } from 'components/Atomic'

export type PieChartData = {
  value: number
  backgroundColor: string
  hoverBackgroundColor: string
  themeBg: string
  iconName: IconName
  iconColor: IconColor
}

export type PieChartProps = {
  data: PieChartData[]
}
