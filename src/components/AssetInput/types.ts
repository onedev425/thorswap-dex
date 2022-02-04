import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelectType } from 'components/AssetSelect/types'

export type AssetInputType = {
  name: AssetTickerType
  value: string
  balance: string
  change?: string
}

export type AssetInputProps = {
  selectedAsset: AssetInputType
  assets: AssetSelectType[]
  commonAssets: AssetSelectType[]
  onValueChange: (assetValue: string) => void
  onAssetChange: (asset: AssetTickerType) => void
  secondary?: boolean
  showChange?: boolean
}
