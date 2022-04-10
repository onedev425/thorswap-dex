import { Asset } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

import { DEFAULT_SLIPPAGE_TOLERANCE } from 'settings/constants/values'

import { ThemeType, ThousandSeparator, ViewMode } from 'types/app'

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
  slippageTolerance: string
  transactionDeadline: string
  autoRouter: boolean
  expertMode: boolean
  customRecipientMode: boolean
  walletViewMode: ViewMode
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
        | 'slippageTolerance'
        | 'transactionDeadline'
        | 'walletViewMode'
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
        | 'autoRouter'
        | 'expertMode'
        | 'customRecipientMode'
      value: boolean
    }

const defaultValues: StorageType = {
  annViewStatus: false,
  baseCurrency: Asset.USD().toString(),
  thousandSeparator: ThousandSeparator.Comma,
  themeType: ThemeType.Auto,
  language: 'en',
  nodeWatchList: [] as string[],
  featuredAssets: [] as string[],
  frequentAssets: [] as string[],
  readStatus: false,
  thorswapAddress: null,
  thorswapKeystore: null,
  tradingHaltStatus: false,
  xDefiConnected: false,
  expertMode: false,
  customRecipientMode: false,
  autoRouter: true,
  slippageTolerance: `${DEFAULT_SLIPPAGE_TOLERANCE}`,
  transactionDeadline: '30',
  walletViewMode: ViewMode.CARD,
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
    case 'expertMode':
    case 'customRecipientMode':
    case 'autoRouter':
      localStorage.setItem(key, value.toString())
      break

    case 'thorswapAddress':
      sessionStorage.setItem(key, value)
      break

    case 'thorswapKeystore':
      sessionStorage.setItem(key, JSON.stringify(value))
      break

    case 'walletViewMode':
      localStorage.setItem(key, value as string)
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
    case 'xDefiConnected':
    case 'autoRouter':
    case 'customRecipientMode':
    case 'expertMode': {
      const item = localStorage.getItem(key)
      return item === 'true'
    }

    case 'thorswapAddress':
      return sessionStorage.getItem('thorswapAddress')

    case 'thorswapKeystore': {
      const item = sessionStorage.getItem('thorswapKeystore')
      return item ? JSON.parse(item) : defaultValues[key]
    }

    case 'walletViewMode': {
      const walletViewMode = localStorage.getItem('walletViewMode')

      if (walletViewMode !== ViewMode.LIST) return ViewMode.CARD

      return walletViewMode ? (walletViewMode as ViewMode) : ViewMode.CARD
    }

    default:
      return localStorage.getItem(key) || defaultValues[key]
  }
}
