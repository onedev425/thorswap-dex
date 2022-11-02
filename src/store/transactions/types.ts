import { Chain } from '@thorswap-lib/types';
import { TxnResult } from 'store/thorswap/types';

export type TransactionStatus = 'error' | 'mined' | 'refund' | 'pending';

export enum TransactionType {
  // TC txns
  SWAP_TC_TO_ETH = 'SWAP:TC-ERC20',
  SWAP_TC_TO_TC = 'SWAP:TC-TC',
  TC_LP_ADD = 'TC:ADDLIQUIDITY',
  TC_LP_WITHDRAW = 'TC:WITHDRAW',
  TC_SEND = 'TC:SEND',
  TC_STATUS = 'TC:STATUS',
  TC_SWITCH = 'TC:SWITCH',
  TC_TNS = 'TC:TNS',
  SWAP_TC_TO_AVAX = 'SWAP:TC-AVAX',

  // AVAX txns
  AVAX_APPROVAL = 'AVAX:APPROVAL',
  AVAX_STATUS = 'AVAX:STATUS',
  SWAP_AVAX_TO_AVAX = 'SWAP:AVAX-AVAX',
  SWAP_AVAX_TO_ETH = 'SWAP:AVAX-ETH',
  SWAP_AVAX_TO_TC = 'SWAP:AVAX-TC',

  // ETH txns
  ETH_APPROVAL = 'ETH:APPROVAL',
  ETH_STATUS = 'ETH:STATUS',
  SWAP_ETH_TO_AVAX = 'SWAP:ETH-AVAX',
  SWAP_ETH_TO_ETH = 'SWAP:ERC20-ERC20',
  SWAP_ETH_TO_TC = 'SWAP:ERC20-TC',

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
