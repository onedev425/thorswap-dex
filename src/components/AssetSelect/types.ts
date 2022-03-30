import { Asset, Amount } from '@thorswap-lib/multichain-sdk'

export type AssetSelectProps = {
  assets: AssetSelectType[]
  commonAssets: AssetSelectType[]
  onSelect: (asset: Asset) => void
  onClose?: () => void
}

export type AssetSelectType = {
  asset: Asset
  balance?: Amount
}
