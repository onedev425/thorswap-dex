import { QuoteMode } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

export type TransactionStatus = 'fail' | 'mined' | 'refund' | 'pending'

export type TrackedTransactionType = {
  id: string
  txid?: string
  chain: Chain
  status: TransactionStatus
  quoteMode: QuoteMode
  timestamp: Date
}

export type PendingTransactionType = {
  id: string
  txid?: string
  chain: Chain
  quoteMode: QuoteMode
  timestamp: Date
}
