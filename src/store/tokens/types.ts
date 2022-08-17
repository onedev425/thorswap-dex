type Version = {
  major: number
  minor: number
  patch: number
}

export type Token = {
  cg?: {
    id: string
    market_cap: number
    name: string
    price_change_24h_usd: number
    price_change_percentage_24h_usd: number
    sparkline_in_7d_usd: string
    total_volume: number
  }
  address: string
  chain?: string
  decimals: number
  identifier: string
  logoURI?: string
  price_usd?: number
  provider: string
  ticker: string
}

export type GetTokenPriceParams = {
  chain: string | number
  address: string
  decimals: string
  identifier?: string
}[]

export type GetTokenPriceResponse = (GetTokenPriceParams[number] & {
  price_usd: number
})[]

export type GetProvidersResponse = {
  nbTokens: number
  provider: string
  version: Version
}[]

export type GetProviderTokensParams = {
  count: number
  keywords: string[]
  name: string
  timestamp: string
  tokens: Token[]
  version: Version
}
