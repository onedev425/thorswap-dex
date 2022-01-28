import { assetIconMap, customIconMap } from './iconList'
import { AssetTickerType, SecondaryIconPlacement } from './types'

const LOGO_SOURCE_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/LOGO_SYMBOL/logo.png'

export const getAssetIconUrl = (assetName: AssetTickerType) => {
  const customIcon = customIconMap[assetName]
  if (customIcon) {
    return customIcon
  }

  const logoSymbol = assetIconMap[assetName]
  if (logoSymbol) {
    return LOGO_SOURCE_URL.replace('LOGO_SYMBOL', logoSymbol)
  }

  return null
}

export const getSecondaryIconPlacementStyle = (
  placement: SecondaryIconPlacement,
  size: number,
) => {
  const offset = size * 0.4

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
