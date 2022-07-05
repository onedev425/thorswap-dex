import { Chain } from '@thorswap-lib/xchain-util'

export const chainName = (chain?: string) =>
  chain === Chain.Cosmos ? 'Cosmos' : chain
