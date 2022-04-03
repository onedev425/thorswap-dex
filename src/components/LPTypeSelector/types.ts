import { Asset } from '@thorswap-lib/multichain-sdk'

import { PoolShareType } from 'redux/midgard/types'

export type LPTypeSelectorProps = {
  poolAsset: Asset
  onChange: (val: PoolShareType) => void
  selected: PoolShareType
  options: PoolShareType[]
}
