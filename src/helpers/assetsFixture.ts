import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'

export const assetsFixture = [
  { asset: Asset.RUNE() },
  { asset: Asset.ETH() },
  { asset: Asset.BTC() },
  { asset: Asset.LUNA() },
  { asset: Asset.DOGE() },
  { asset: Asset.UST() },
  { asset: Asset.BNB() },
  { asset: Asset.BCH() },
  { asset: Asset.USD() },
] as AssetSelectType[]

export const commonAssets = assetsFixture.slice(0, 3)
