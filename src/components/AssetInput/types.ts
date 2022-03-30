import { Asset, Amount, Price } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'

export type AssetInputType = {
  asset: Asset
  usdPrice?: Price
  balance?: Amount
  value?: Amount
}

export type AssetInputProps = {
  className?: string
  inputClassName?: string
  selectedAsset: AssetInputType
  secondaryLabel?: string
  onValueChange?: (assetValue: Amount) => void
  hideMaxButton?: boolean
} & (
  | {
      assets?: undefined
      commonAssets?: undefined
      onAssetChange?: undefined
      singleAsset: true
    }
  | {
      assets: AssetSelectType[]
      commonAssets?: AssetSelectType[]
      onAssetChange: (asset: Asset) => void
      singleAsset?: undefined
    }
)
