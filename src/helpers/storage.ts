import { Asset } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

import { ThemeType, ThousandSeparator } from './../types/global'

type StorageType = {
  annViewStatus: boolean
  baseCurrency: string
  thousandSeparator: string
  themeType: string
  language: string
  nodeWatchList: string[]
  featuredAssets: string[]
  frequentAssets: string[]
  readStatus: boolean
  thorswapAddress: string | null
  thorswapKeystore: Keystore | null
  tradingHaltStatus: boolean
  xDefiConnected: boolean
}

type StoragePayload =
  | {
      key:
        | 'language'
        | 'baseCurrency'
        | 'thorswapKeystore'
        | 'thorswapAddress'
        | 'thousandSeparator'
        | 'themeType'
      value: string
    }
  | {
      key: 'nodeWatchList' | 'frequentAssets' | 'featuredAssets'
      value: string[]
    }
  | {
      key:
        | 'annViewStatus'
        | 'tradingHaltStatus'
        | 'readStatus'
        | 'xDefiConnected'
      value: boolean
    }

const defaultValues: StorageType = {
  annViewStatus: false,
  baseCurrency: Asset.USD().toString(),
  thousandSeparator: ThousandSeparator.Space as string,
  themeType: ThemeType.Auto as string,
  language: 'en',
  nodeWatchList: [] as string[],
  featuredAssets: [] as string[],
  frequentAssets: [] as string[],
  readStatus: false,
  thorswapAddress: null,
  thorswapKeystore: null,
  tradingHaltStatus: false,
  xDefiConnected: false,
}

export const saveInStorage = ({ key, value }: StoragePayload) => {
  switch (key) {
    case 'nodeWatchList':
    case 'frequentAssets':
    case 'featuredAssets':
      localStorage.setItem(key, JSON.stringify(value))
      break

    case 'annViewStatus':
    case 'tradingHaltStatus':
    case 'readStatus':
    case 'xDefiConnected':
      localStorage.setItem(key, value.toString())
      break

    case 'thorswapAddress':
      sessionStorage.setItem(key, value)
      break

    case 'thorswapKeystore':
      sessionStorage.setItem(key, JSON.stringify(value))
      break

    default:
      localStorage.setItem(key, value)
      break
  }
}

export const getFromStorage = (
  key: keyof StorageType,
): StorageType[keyof StorageType] => {
  switch (key) {
    case 'nodeWatchList':
    case 'featuredAssets':
    case 'frequentAssets': {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValues[key]
    }

    case 'annViewStatus':
    case 'tradingHaltStatus':
    case 'readStatus':
    case 'xDefiConnected': {
      const item = localStorage.getItem(key)
      return item === 'true'
    }

    case 'thorswapAddress':
      return sessionStorage.getItem('thorswapAddress')

    case 'thorswapKeystore': {
      const item = sessionStorage.getItem('thorswapKeystore')
      return item ? JSON.parse(item) : defaultValues[key]
    }

    default:
      return localStorage.getItem(key) || defaultValues[key]
  }
}
