import { Asset } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

import { DEFAULT_SLIPPAGE_TOLERANCE } from 'settings/constants/values'

import {
  SupportedLanguages,
  ThemeType,
  ThousandSeparator,
  ViewMode,
} from 'types/app'

type StorageType = {
  annViewStatus: boolean
  baseCurrency: string
  thousandSeparator: string
  themeType: string
  language: SupportedLanguages
  nodeWatchList: string[]
  featuredAssets: string[]
  frequentAssets: string[]
  readStatus: boolean
  thorswapAddress: string | null
  thorswapKeystore: Keystore | null
  tradingHaltStatus: boolean
  slippageTolerance: string
  transactionDeadline: string
  autoRouter: boolean
  expertMode: boolean
  customRecipientMode: boolean
  walletViewMode: ViewMode
  statsHidden: boolean
  chartsHidden: boolean
  poolsHidden: boolean
  dismissedAnnList: string[]
  sidebarCollapsed: boolean
  terraWalletSession: string | null
}

type StoragePayload =
  | {
      key:
        | 'baseCurrency'
        | 'language'
        | 'slippageTolerance'
        | 'terraWalletSession'
        | 'themeType'
        | 'thorswapAddress'
        | 'thorswapKeystore'
        | 'thousandSeparator'
        | 'transactionDeadline'
        | 'walletViewMode'
      value: string
    }
  | {
      key:
        | 'nodeWatchList'
        | 'frequentAssets'
        | 'featuredAssets'
        | 'dismissedAnnList'
      value: string[]
    }
  | {
      key:
        | 'annViewStatus'
        | 'autoRouter'
        | 'chartsHidden'
        | 'customRecipientMode'
        | 'expertMode'
        | 'poolsHidden'
        | 'readStatus'
        | 'sidebarCollapsed'
        | 'statsHidden'
        | 'tradingHaltStatus'
      value: boolean
    }

const defaultValues: StorageType = {
  statsHidden: false,
  chartsHidden: false,
  poolsHidden: false,
  dismissedAnnList: [] as string[],
  sidebarCollapsed: false,
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
  expertMode: false,
  customRecipientMode: false,
  autoRouter: true,
  slippageTolerance: `${DEFAULT_SLIPPAGE_TOLERANCE}`,
  transactionDeadline: '30',
  walletViewMode: ViewMode.CARD,
  terraWalletSession: null,
}

export const saveInStorage = ({ key, value }: StoragePayload) => {
  switch (key) {
    case 'nodeWatchList':
    case 'frequentAssets':
    case 'featuredAssets':
    case 'dismissedAnnList':
      localStorage.setItem(key, JSON.stringify(value))
      break

    case 'annViewStatus':
    case 'statsHidden':
    case 'chartsHidden':
    case 'poolsHidden':
    case 'sidebarCollapsed':
    case 'tradingHaltStatus':
    case 'readStatus':
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

    case 'terraWalletSession': {
      const terraKey = '__terra_extension_router_session__'
      localStorage.setItem(terraKey, value as string)
      break
    }

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
    case 'dismissedAnnList':
    case 'frequentAssets': {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValues[key]
    }

    case 'annViewStatus':
    case 'statsHidden':
    case 'chartsHidden':
    case 'poolsHidden':
    case 'sidebarCollapsed':
    case 'tradingHaltStatus':
    case 'readStatus':
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

    case 'terraWalletSession': {
      const item = localStorage.getItem('__terra_extension_router_session__')
      return item ? JSON.parse(item).identifier : undefined
    }

    default:
      return localStorage.getItem(key) || defaultValues[key]
  }
}
