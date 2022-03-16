import { SupportedChain, Wallet } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

export interface GeckoData {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  atl: number
  atl_change_percentage: number
  roi: null
  last_updated: Date
  sparkline_in_7d: {
    price: number[]
  }
}

export interface State {
  isConnectModalOpen: boolean
  keystore: Keystore | null
  wallet: Wallet | null
  chainWalletLoading: { [key in SupportedChain]: boolean }
  walletLoading: boolean
  geckoData: Record<string, GeckoData>
  geckoDataLoading: Record<string, boolean>
}
