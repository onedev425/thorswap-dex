import { AssetTickerType } from 'components/AssetIcon/types'
import { IconName } from 'components/Atomic'

export type AssetDataType = {
  title: string
  assetTicker: AssetTickerType
  amount: string
  infoIcon?: IconName
  icon: AssetTickerType
}
