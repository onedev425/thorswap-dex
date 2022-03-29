import { MemberPool } from '@thorswap-lib/midgard-sdk'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { ChainMemberDetails, LiquidityProvider } from './types'

export const isPendingLP = (data: LiquidityProvider): boolean => {
  const isPending =
    Number(data.pending_asset) > 0 || Number(data.pending_rune) > 0

  return isPending
}

export const getChainMemberDetails = ({
  chain,
  memPools,
  chainMemberDetails,
}: {
  chain: SupportedChain
  memPools: MemberPool[]
  chainMemberDetails: ChainMemberDetails
}): ChainMemberDetails => {
  // get rune asym share from memPools fetched with thorchain address
  if (chain === THORChain) {
    memPools.forEach((memPool: MemberPool) => {
      const { pool, runeAdded, assetAdded } = memPool

      const poolChain = pool.split('.')[0] as SupportedChain
      let chainMemberData = chainMemberDetails?.[poolChain] ?? {}
      let poolMemberData = chainMemberData?.[pool] ?? {}

      // get rune asymm share & sym share
      if (Number(assetAdded) === 0 && Number(runeAdded) > 0) {
        poolMemberData = {
          ...poolMemberData,
          runeAsym: memPool,
        }

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        }

        chainMemberDetails[poolChain] = chainMemberData
      } else if (Number(runeAdded) > 0 && Number(assetAdded) > 0) {
        // sym share
        poolMemberData = {
          ...poolMemberData,
          sym: memPool,
        }

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        }

        chainMemberDetails[poolChain] = chainMemberData
      }
    })
  }

  // get only asset asym share
  if (chain !== THORChain) {
    memPools.forEach((memPool: MemberPool) => {
      const { pool, runeAdded, assetAdded } = memPool

      const poolChain = pool.split('.')[0] as SupportedChain
      let chainMemberData = chainMemberDetails?.[poolChain] ?? {}

      let poolMemberData = chainMemberData?.[pool] ?? {}

      // check asset asymm share
      if (Number(runeAdded) === 0 && Number(assetAdded) > 0) {
        poolMemberData = {
          ...poolMemberData,
          assetAsym: memPool,
        }

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        }

        chainMemberDetails[poolChain] = chainMemberData
      }
    })
  }

  return chainMemberDetails
}
