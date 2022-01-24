import { ColorType } from '../../types/global'
import { IconName } from '../Icon'

export type PoolCardProps = {
  coinSymbol: string
  iconName: IconName
  color: ColorType
  price: number
  change: number
}
