import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'

export type AssetInputType = {
  asset: Asset
  value: string
  balance: string
  change?: string
}

export type AssetInputProps = {
  selectedAsset: AssetInputType
  assets: AssetSelectType[]
  commonAssets: AssetSelectType[]
  secondary?: boolean
  showChange?: boolean
  secondaryLabel?: string
  onAssetChange: (asset: Asset) => void
  onValueChange: (assetValue: string) => void
}
