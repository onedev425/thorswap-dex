import type { QuoteRoute, TxStatus, TxTrackerDetails } from '@swapkit/api';
import type { Chain } from '@swapkit/core';
import type { TxnMeta, TxnTransient } from 'components/TransactionTrackerV2/types';
import type { BorrowQuoteResponse, RepayQuoteResponse, TxnResult } from 'store/thorswap/types';

export type TransactionStatus = 'error' | 'mined' | 'refund' | 'pending' | 'unknown' | 'notStarted';

export enum TransactionType {
  // Old quote mode
  SWAP_TC_TO_TC = 'SWAP:TC-TC',
  SWAP_ETH_TO_TC = 'SWAP:ERC20-TC',
  SWAP_TC_TO_ETH = 'SWAP:TC-ERC20',
  SWAP_ETH_TO_ETH = 'SWAP:ERC20-ERC20',
  // Old quote mode: AVAX
  SWAP_AVAX_TO_TC = 'SWAP:AVAX-TC',
  SWAP_TC_TO_AVAX = 'SWAP:TC-AVAX',
  SWAP_AVAX_TO_AVAX = 'SWAP:AVAX-AVAX',
  SWAP_ETH_TO_AVAX = 'SWAP:ETH-AVAX',
  SWAP_AVAX_TO_ETH = 'SWAP:AVAX-ETH',
  // Old quote mode: BSC
  SWAP_BSC_TO_TC = 'SWAP:BSC-TC',
  SWAP_TC_TO_BSC = 'SWAP:TC-BSC',
  SWAP_BSC_TO_BSC = 'SWAP:BSC-BSC',
  SWAP_ETH_TO_BSC = 'SWAP:ETH-BSC',
  SWAP_BSC_TO_ETH = 'SWAP:BSC-ETH',
  // ATOM
  SWAP_TC_TO_GAIA = 'SWAP:TC-GAIA',
  SWAP_GAIA_TO_TC = 'SWAP:GAIA-TC',
  // BNB
  SWAP_TC_TO_BNB = 'SWAP:TC-BNB',
  SWAP_BNB_TO_TC = 'SWAP:BNB-TC',
  // BTC
  SWAP_TC_TO_BTC = 'SWAP:TC-BTC',
  SWAP_BTC_TO_TC = 'SWAP:BTC-TC',
  // BCH
  SWAP_TC_TO_BCH = 'SWAP:TC-BCH',
  SWAP_BCH_TO_TC = 'SWAP:BCH-TC',
  // LTC
  SWAP_TC_TO_LTC = 'SWAP:TC-LTC',
  SWAP_LTC_TO_TC = 'SWAP:LTC-TC',
  // DOGE
  SWAP_TC_TO_DOGE = 'SWAP:TC-DOGE',
  SWAP_DOGE_TO_TC = 'SWAP:DOGE-TC',
  // TC txns
  TC_STATUS = 'TC:STATUS', // only track status
  TC_TRANSFER = 'TC:TRANSFER', // only track status
  TC_DEPOSIT = 'TC:DEPOSIT',
  TC_SEND = 'TC:SEND',
  TC_SWITCH = 'TC:SWITCH',
  TC_LP_ADD = 'TC:ADDLIQUIDITY',
  TC_LP_WITHDRAW = 'TC:WITHDRAW', // Supports 'WITHDRAWLIQUIDITY' as well
  TC_TNS_CREATE = 'TC:TNS-CREATE',
  TC_TNS_EXTEND = 'TC:TNS-EXTEND',
  TC_TNS_UPDATE = 'TC:TNS-UPDATE',
  // SAVINGS
  TC_SAVINGS_ADD = 'TC:ADDSAVINGS',
  TC_SAVINGS_WITHDRAW = 'TC:WITHDRAWSAVINGS',
  // LENDING
  TC_LENDING_OPEN = 'TC:LENDINGOPEN',
  TC_LENDING_CLOSE = 'TC:LENDINGCLOSE',
  // ERC-20 txns
  ETH_APPROVAL = 'ETH:APPROVAL',
  ETH_STATUS = 'ETH:STATUS', // only track status
  ETH_TRANSFER_TO_TC = 'ETH:TRANSFER:IN',
  ETH_TRANSFER_FROM_TC = 'ETH:TRANSFER:OUT',
  // AVAX
  AVAX_APPROVAL = 'AVAX:APPROVAL',
  AVAX_STATUS = 'AVAX:STATUS', // only track status
  AVAX_TRANSFER_TO_TC = 'AVAX:TRANSFER:IN',
  AVAX_TRANSFER_FROM_TC = 'AVAX:TRANSFER:OUT',
  // BSC
  BSC_APPROVAL = 'BSC:APPROVAL',
  BSC_STATUS = 'BSC:STATUS', // only track status
  BSC_TRANSFER_TO_TC = 'BSC:TRANSFER:IN',
  BSC_TRANSFER_FROM_TC = 'BSC:TRANSFER:OUT',
  // Generic types
  APPROVAL = 'APPROVAL',
  STATUS = 'STATUS',
  TRANSFER_TO_TC = 'TRANSFER:IN',
  TRANSFER_FROM_TC = 'TRANSFER:OUT',
  // Unsupported
  UNSUPPORTED = 'UNSUPPORTED',
  // Lending
  TC_LENDING = 'TC:LENDING',
}

export type TrackerV2Details = { transient?: TxnTransient; meta?: TxnMeta; isV2?: boolean };

export type PendingTransactionType = {
  from?: string;
  id: string;
  inChain: Chain;
  label: string;
  outChain?: Chain;
  timestamp: Date;
  txid?: string;
  type: TransactionType;
  completed?: boolean;
  hash?: string;
  quoteId?: string;
  route?: QuoteRoute;
  details?: TxTrackerDetails & TrackerV2Details;
  sellAmount?: string;
  sellAmountNormalized?: string;
  status?: TransactionStatus;
  recipient?: string;
  streamingSwap?: boolean;
  advancedTracker?: boolean;
  initialPayload?: InitialTrackerPayload;
};

export type CompletedTransactionType = PendingTransactionType & {
  result?: TxnResult | string;
  status: TransactionStatus;
  timestamp: Date;
  txid?: string;
  completed: true;
  hideDetails?: boolean;
  txUrl?: string;
};

export type TransactionsState = (PendingTransactionType | CompletedTransactionType)[];

export type TxTrackerLeg = {
  hash?: string;
  chain: Chain;
  provider?: string;
  txnType?: TransactionType;

  // transaction details
  fromAsset?: string;
  fromAssetImage?: string;
  toAsset?: string;
  toAssetImage?: string;
  fromAmount?: string;
  toAmount?: string;
  toAmountLimit?: string;
  startTimestamp?: number | null; // null before this leg has started
  updateTimestamp?: number | null; // timestamp of last update
  endTimestamp?: number | null; // null before this leg has ended
  estimatedEndTimestamp?: number | null; // null before this leg has started
  estimatedDuration?: number | null; // null before this leg has started
  status?: TxStatus;
  waitingFor?: string;
  opaque?: any;
};

export type TrackerLendingPayload = {
  isLending: true;
  fromAddress: string;
} & (BorrowQuoteResponse | RepayQuoteResponse);

// Initial tracker payload for txns other than swaps
export type InitialTrackerPayload = TrackerLendingPayload;
