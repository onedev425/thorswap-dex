import {
  BCHChain,
  BNBChain,
  BTCChain,
  CosmosChain,
  DOGEChain,
  ETHChain,
  LTCChain,
  SOLChain,
  TERRAChain,
  THORChain,
} from '@thorswap-lib/xchain-util'

export const SORTED_CHAINS = [
  THORChain,
  BTCChain,
  SOLChain,
  TERRAChain,
  ETHChain,
  BNBChain,
  DOGEChain,
  BCHChain,
  LTCChain,
  CosmosChain,
] as const
