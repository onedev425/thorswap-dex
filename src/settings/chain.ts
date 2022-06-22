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

import { IS_STAGENET } from 'settings/config'

const stagenetChains = (IS_STAGENET ? [CosmosChain] : []) as [
  typeof CosmosChain,
]

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
  ...stagenetChains,
] as const
