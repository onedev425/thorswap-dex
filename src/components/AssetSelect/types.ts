import { AssetTickerType } from 'components/AssetIcon/types'

export type AssetSelectProps = {
  assets: AssetSelectType[]
  commonAssets: AssetSelectType[]
  onSelect: (asset: AssetTickerType) => void
  onClose: () => void
}

export type AssetSelectType = {
  name: AssetTickerType
  type: string
  balance?: number | null
}
