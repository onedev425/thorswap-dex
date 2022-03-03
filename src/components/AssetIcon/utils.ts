import { Asset } from '@thorswap-lib/multichain-sdk'

import { multichain } from 'services/multichain'

import {
  assetIconMap,
  customIconMap,
  BepIconType,
  CustomIconType,
} from './iconList'
import { SecondaryIconPlacement } from './types'

const twBaseUri =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains'

export const getAssetIconUrl = (asset: Asset) => {
  if (Object.keys(customIconMap).includes(asset.ticker)) {
    return customIconMap[asset.ticker as CustomIconType]
  }

  if (Object.keys(customIconMap).includes(asset.symbol)) {
    return customIconMap[asset.symbol as CustomIconType]
  }

  if (asset.chain === 'ETH' && asset.ticker !== 'ETH') {
    if (asset.ticker === 'WETH') {
      return 'https://assets.coingecko.com/coins/images/2518/large/weth.png'
    }

    const contract = multichain.eth.getCheckSumAddress(asset)

    return `${twBaseUri}/ethereum/assets/${contract}/logo.png`
  }

  const logoSymbol = assetIconMap[asset.ticker as BepIconType]
  if (logoSymbol) {
    return `${twBaseUri}/binance/assets/${logoSymbol}/logo.png`
  }

  return `${twBaseUri}/binance/assets/${asset.symbol}/logo.png`
}

export const getSecondaryIconPlacementStyle = (
  placement: SecondaryIconPlacement,
  size: number,
) => {
  const offset = size * 0.3

  switch (placement) {
    case 'tl': {
      return { top: 0, left: -offset }
    }
    case 'tr': {
      return { top: 0, right: -offset }
    }
    case 'bl': {
      return { bottom: 0, left: -offset }
    }
    case 'br': {
      return { bottom: 0, right: -offset }
    }
  }
}
