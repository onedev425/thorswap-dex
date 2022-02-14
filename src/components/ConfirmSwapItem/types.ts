import { AssetTickerType } from 'components/AssetIcon/types'
import Icons from 'components/Icon/iconList'
export type IconName = keyof typeof Icons

export type AssetDataType = {
  title: string
  assetTicker: AssetTickerType
  amount: string
  infoIcon?: IconName
  icon: AssetTickerType
}
