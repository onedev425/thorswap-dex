import { Chain } from '@thorswap-lib/xchain-util'

import { SORTED_CHAINS } from 'settings/chain'

export const sortChains = (chains: string[]) => {
  const sorted: Chain[] = []

  SORTED_CHAINS.forEach((chain) => {
    if (chains.includes(chain)) sorted.push(chain)
  })

  return sorted
}
