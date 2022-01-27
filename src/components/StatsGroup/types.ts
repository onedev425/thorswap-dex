import { ColorType } from '../../types/global'
import { IconName } from '../Icon'

export type LeafProps = {
  label: string
  value: number
  borderClass: string
}

export type StatsGroupProps = {
  totalVolume: number
  depositVolume: number
  swapVolume: number
  withdrawVolume: number
  iconName: IconName
  iconColor: ColorType
}
