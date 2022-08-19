import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { QuoteMode } from '@thorswap-lib/multichain-sdk'

import { TransactionStatus } from 'store/transactions/types'

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

export type GetTxnStatusResponse =
  | { ok: false; status: 'pending'; result: string }
  | { ok: true; status: TransactionStatus; result?: SuccessTxnResult }

const API_USAGE_URL = 'https://apiusage-vlpfe7es4a-uc.a.run.app'

export const apiUsageApi = createApi({
  reducerPath: 'apiUsage',
  baseQuery: fetchBaseQuery({
    baseUrl: API_USAGE_URL,
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoints: (build) => ({
    getTxnStatus: build.query<GetTxnStatusResponse, GetTxnStatusParams>({
      query: (params) => `/txn?${new URLSearchParams(params).toString()}`,
    }),
  }),
})

export const { useGetTxnStatusQuery } = apiUsageApi
