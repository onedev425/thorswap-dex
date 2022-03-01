import { Asset } from '@thorswap-lib/multichain-sdk'

import { IconName } from 'components/Atomic'

export type AssetDataType = {
  title: string
  asset: Asset
  amount: string
  infoIcon?: IconName
}
