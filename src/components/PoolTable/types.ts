import { IconName } from 'components/Atomic'

import { ColorType } from 'types/global'

export type PoolData = {
  asset: { name: string; icon: IconName; iconColor: ColorType }
  network: string
  price: string
  liquidity: string
  volume: string
  apy: string
  action: string
}
export type PoolTableProps = {
  data: PoolData[]
  onAddLiquidity?: () => {}
  onRefresh?: () => {}
  onSwap?: () => {}
}
