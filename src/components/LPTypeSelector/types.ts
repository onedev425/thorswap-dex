import { Asset } from '@thorswap-lib/multichain-sdk'

import { PoolShareType } from 'store/midgard/types'

export type LPTypeSelectorProps = {
  poolAsset: Asset
  onChange: (val: PoolShareType) => void
  selected: PoolShareType
  options: PoolShareType[]
  title?: string
  itemsCount?: number
}
