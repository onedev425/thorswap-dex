import {
  BCHChain,
  BNBChain,
  BTCChain,
  CosmosChain,
  DOGEChain,
  ETHChain,
  LTCChain,
  SOLChain,
  THORChain,
} from '@thorswap-lib/xchain-util'

export const SORTED_CHAINS = [
  THORChain,
  BTCChain,
  SOLChain,
  ETHChain,
  BNBChain,
  DOGEChain,
  BCHChain,
  LTCChain,
  CosmosChain,
] as const
