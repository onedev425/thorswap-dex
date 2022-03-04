import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectType } from 'components/AssetSelect/types'

export const assetsFixture = [
  { asset: Asset.RUNE(), type: 'native', balance: '0', change: '0.5' },
  { asset: Asset.ETH(), type: 'native', balance: '4.7', change: '0.5' },
  { asset: Asset.THOR(), type: '-', balance: '11', change: '0.5' },
  { asset: Asset.BTC(), type: 'native', balance: '0', change: '0.5' },
  { asset: Asset.LUNA(), type: 'native', balance: '38', change: '0.5' },
  { asset: Asset.DOGE(), type: 'native', balance: '0', change: '0.5' },
  { asset: Asset.UST(), type: 'native', balance: '0', change: '0.5' },
] as AssetSelectType[]

export const commonAssets = assetsFixture.slice(0, 3)
