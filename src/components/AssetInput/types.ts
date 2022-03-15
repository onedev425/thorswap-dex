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
  secondary?: boolean
  showChange?: boolean
  secondaryLabel?: string
  onValueChange: (assetValue: string) => void
} & (
  | {
      assets?: undefined
      commonAssets?: undefined
      onAssetChange?: undefined
      singleAsset: true
    }
  | {
      assets: AssetSelectType[]
      commonAssets: AssetSelectType[]
      onAssetChange: (asset: Asset) => void
      singleAsset?: undefined
    }
)
