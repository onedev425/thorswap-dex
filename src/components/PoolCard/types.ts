import { Asset } from '@thorswap-lib/multichain-sdk'

import { IconName } from 'components/Atomic'

import { ColorType } from 'types/global'

export type PoolCardProps = {
  asset: Asset
  iconName: IconName
  color: ColorType
  price: number
  change: number
}
