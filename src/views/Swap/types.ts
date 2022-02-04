import { AssetTickerType } from 'components/AssetIcon/types'

export type RouterStepProps = {
  assets: [string] | [AssetTickerType, AssetTickerType]
  commission: string
}
