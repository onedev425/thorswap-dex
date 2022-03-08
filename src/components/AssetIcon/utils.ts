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

export const checkIfImageExists = (url: string): boolean => {
  const img = new Image()

  img.src = url

  if (img.complete) {
    return true
  } else {
    img.onload = () => {
      return true
    }

    img.onerror = () => {
      return false
    }
  }

  return false
}

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
    const logoUrl = `${twBaseUri}/ethereum/assets/${contract}/logo.png`

    return checkIfImageExists(logoUrl) ? logoUrl : ''
  }

  const logoSymbol = assetIconMap[asset.ticker as BepIconType]
  if (logoSymbol) {
    return `${twBaseUri}/binance/assets/${logoSymbol}/logo.png`
  }

  const bep2LogoUrl = `${twBaseUri}/binance/assets/${asset.symbol}/logo.png`
  return checkIfImageExists(bep2LogoUrl) ? bep2LogoUrl : ''
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

export const rgb2hex = (r: number, g: number, b: number) =>
  `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`

export const rainbowStop = (h: number) => {
  const f = (n: number, k = (n + h * 12) % 12) =>
    0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return rgb2hex(
    Math.floor(f(0) * 255),
    Math.floor(f(8) * 255),
    Math.floor(f(4) * 255),
  )
}

export const getIntFromName = (str: string): number[] => {
  const inputStr = String(str).toUpperCase()

  const div = 22

  const firstInt = (inputStr.charCodeAt(0) - 'A'.charCodeAt(0)) / div
  const secondInt =
    inputStr.length > 1 ? (inputStr.charCodeAt(1) - 'A'.charCodeAt(0)) / div : 0

  return [Number(firstInt.toFixed(2)), Number(secondInt.toFixed(2))]
}
