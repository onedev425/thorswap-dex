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
  disabled?: boolean
  warning?: string
  maxButtonLabel?: string
} & (
  | {
      assets: AssetSelectType[]
      commonAssets: AssetSelectType[]
      onAssetChange: (asset: Asset) => void
      poolAsset?: undefined
      showSecondaryChainSelector?: undefined
      singleAsset?: undefined
    }
  | {
      assets: AssetSelectType[]
      commonAssets: AssetSelectType[]
      onAssetChange: (asset: Asset) => void
      poolAsset: AssetInputType
      showSecondaryChainSelector: boolean
      singleAsset: true
    }
  | {
      assets?: undefined
      commonAssets?: undefined
      onAssetChange?: undefined
      poolAsset?: undefined
      showSecondaryChainSelector?: undefined
      singleAsset: true
    }
)
