import { Chain } from '@thorswap-lib/types';
import { TxnResult } from 'store/thorswap/types';

export type TransactionStatus = 'error' | 'mined' | 'refund' | 'pending';

export enum TransactionType {
  SWAP_TC_TO_TC = 'SWAP:TC-TC',
  SWAP_ETH_TO_TC = 'SWAP:ERC20-TC',
  SWAP_TC_TO_ETH = 'SWAP:TC-ERC20',
  SWAP_ETH_TO_ETH = 'SWAP:ERC20-ERC20',

  // TC txns
  TC_STATUS = 'TC:STATUS', // only track status
  TC_SEND = 'TC:SEND',
  TC_SWITCH = 'TC:SWITCH',
  TC_LP_ADD = 'TC:ADDLIQUIDITY',
  TC_LP_WITHDRAW = 'TC:WITHDRAW', // Supports 'WITHDRAWLIQUIDITY' as well
  TC_TNS = 'TC:TNS',

  // ARC-20 txns
  AVAX_APPROVAL = 'AVAX:APPROVAL',
  AVAX_STATUS = 'AVAX:STATUS',

  // ERC-20 txns
  ETH_APPROVAL = 'ETH:APPROVAL',
  ETH_STATUS = 'ETH:STATUS', // only track status
  // Unsupported
  UNSUPPORTED = 'UNSUPPORTED',
}

export type PendingTransactionType = {
  from?: string;
  id: string;
  inChain: Chain;
  label: string;
  outChain?: Chain;
  timestamp: Date;
  txid?: string;
  type: TransactionType;
};

export type CompletedTransactionType = PendingTransactionType & {
  result?: TxnResult | string;
  status: TransactionStatus;
  timestamp: Date;
  txid?: string;
};
