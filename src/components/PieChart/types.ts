import { IconColor, IconName } from 'components/Icon'

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
