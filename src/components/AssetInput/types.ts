import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'

export type AssetInputType = {
  asset: Asset
  price: string
  balance?: string
  value: string
  change?: string
}

export type AssetInputProps = {
  className?: string
  selectedAsset: AssetInputType
  assets: AssetSelectType[]
  commonAssets: AssetSelectType[]
  secondary?: boolean
  showChange?: boolean
  secondaryLabel?: string
  onAssetChange: (asset: Asset) => void
  onValueChange: (assetValue: string) => void
}
