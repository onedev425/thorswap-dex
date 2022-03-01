import { Asset } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

const THORSWAP_ANNOUNCEMENT = 'THORSWAP_ANNOUNCEMENT'

const ANN_VIEW_STATUS = 'ANN_VIEW_STATUS'
const TRADING_HALT_ANN = 'TRADING_HALT_ANN'
const THORSWAP_MULTICHAIN_KEYSTORE = 'THORSWAP_MULTICHAIN_KEYSTORE'
const THORSWAP_MULTICHAIN_ADDR = 'THORSWAP_MULTICHAIN_ADDR'
const THORSWAP_XDEFI_STATUS = 'THORSWAP_XDEFI_STATUS'

const BASE_CURRENCY = 'BASE_CURRENCY'
const NODE_WATCHLIST = 'NODE_WATCHLIST'

export const saveBaseCurrency = (currency: string) => {
  localStorage.setItem(BASE_CURRENCY, currency)
}

export const getBaseCurrency = (): string => {
  return (
    (localStorage.getItem(BASE_CURRENCY) as string) || Asset.USD().toString()
  )
}

export const saveKeystore = (keystore: Keystore) => {
  sessionStorage.setItem(THORSWAP_MULTICHAIN_KEYSTORE, JSON.stringify(keystore))
}

export const getKeystore = (): Keystore | null => {
  const item = sessionStorage.getItem(THORSWAP_MULTICHAIN_KEYSTORE)

  if (item) {
    return JSON.parse(item) as Keystore
  }

  return null
}

// save xdefi status to localstorage
export const saveXdefiConnected = (connected: boolean) => {
  if (connected) {
    localStorage.setItem(THORSWAP_XDEFI_STATUS, 'connected')
  } else {
    localStorage.removeItem(THORSWAP_XDEFI_STATUS)
  }
}

export const getXdefiConnected = (): boolean => {
  return localStorage.getItem(THORSWAP_XDEFI_STATUS) === 'connected'
}

export const saveAddress = (address: string) => {
  sessionStorage.setItem(THORSWAP_MULTICHAIN_ADDR, address)
}

export const getAddress = (): string | null => {
  const item = sessionStorage.getItem(THORSWAP_MULTICHAIN_ADDR)

  if (item) {
    return item
  }
  return null
}

export const setReadStatus = (read: boolean) => {
  localStorage.setItem(THORSWAP_ANNOUNCEMENT, read.toString())
}

export const getReadStatus = (): boolean => {
  const read = localStorage.getItem(THORSWAP_ANNOUNCEMENT) === 'true'
  return read
}

export const setTradingHaltStatus = (read: boolean) => {
  localStorage.setItem(TRADING_HALT_ANN, read.toString())
}

export const getAnnViewStatus = () => {
  const read = localStorage.getItem(ANN_VIEW_STATUS) === 'true'
  return read
}

export const setAnnViewStatus = (read: boolean) => {
  localStorage.setItem(ANN_VIEW_STATUS, read.toString())
}

export const getTradingHaltStatus = (): boolean => {
  const read = localStorage.getItem(TRADING_HALT_ANN) === 'true'
  return read
}

export const setNodeWatchList = (watchList: string[]) => {
  localStorage.setItem(NODE_WATCHLIST, JSON.stringify(watchList))
}

export const getNodeWatchList = (): string[] => {
  const watchList = localStorage.getItem(NODE_WATCHLIST)

  if (!watchList) {
    return []
  }

  return JSON.parse(watchList)
}
