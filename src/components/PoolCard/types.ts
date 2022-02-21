import { IconName } from 'components/Atomic'

import { ColorType } from 'types/global'

export type PoolCardProps = {
  coinSymbol: string
  iconName: IconName
  color: ColorType
  price: number
  change: number
}
