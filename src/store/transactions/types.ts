import { QuoteMode } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

import { SuccessTxnResult } from 'store/apiUsage/api'

export type TransactionStatus = 'error' | 'mined' | 'refund' | 'pending'
export type TransactionType = 'swap' | 'approve'

export type CompletedTransactionType = {
  inChain: Chain
  outChain?: Chain
  id: string
  label: string
  quoteMode: QuoteMode
  result?: SuccessTxnResult
  status: TransactionStatus
  timestamp: Date
  txid?: string
  type?: TransactionType
}

export type PendingTransactionType = {
  inChain: Chain
  outChain?: Chain
  id: string
  label: string
  quoteMode: QuoteMode
  timestamp: Date
  txid?: string
  type?: TransactionType
}
