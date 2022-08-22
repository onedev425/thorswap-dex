import { QuoteMode } from '@thorswap-lib/multichain-sdk'

import { TransactionStatus } from 'store/transactions/types'

export type GetTokensQuoteParams = {
  affiliateBasisPoints?: string
  buyAsset: string
  providers?: string[]
  recipientAddress?: string
  sellAmount: string
  sellAsset: string
  senderAddress?: string
  slippage: string
}

export type GetTxnStatusParams = {
  txid?: string
  quoteMode?: QuoteMode
  from: string
}

export type SuccessTxnResult = {
  blockNumber: number
  cumulativeGasUsed: string
  effectiveGasPrice: string
  inputAsset: string
  inputAssetAmount: string
  inputAssetPriceUSD: number
  inputAssetPriceUSDTimestamp: string
  memo: string
  outputAsset: string
  outputAssetAmount: string
  outputAssetPriceUSD: number
  outputAssetPriceUSDTimestamp: string
  quoteMode?: QuoteMode
  status: number
  transactionHash: string
  type: string
  userAddress: string
}

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

export type GetTxnStatusResponse =
  | { ok: false; status: 'pending'; result: string }
  | { ok: true; status: TransactionStatus; result?: SuccessTxnResult }
