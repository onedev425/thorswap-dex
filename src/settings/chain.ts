import {
  BCHChain,
  BNBChain,
  BTCChain,
  DOGEChain,
  ETHChain,
  LTCChain,
  TERRAChain,
  THORChain,
} from '@thorswap-lib/xchain-util'

export const SORTED_CHAINS = [
  THORChain,
  BTCChain,
  TERRAChain,
  ETHChain,
  BNBChain,
  DOGEChain,
  BCHChain,
  LTCChain,
] as const
