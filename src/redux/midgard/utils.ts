import { MemberPool } from '@thorswap-lib/midgard-sdk'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { ChainMemberDetails } from './types'

export const hasPendingLP = (data: ChainMemberDetails): boolean => {
  const chainMemberDataArray = Object.values(data)
  for (let i = 0; i < chainMemberDataArray.length; i++) {
    const chainMemberData = chainMemberDataArray[i]
    const poolMemberDataArray = Object.values(chainMemberData)
    for (let j = 0; j < poolMemberDataArray.length; j++) {
      const poolMemberData = poolMemberDataArray[j]

      const symPosition = poolMemberData?.sym

      if (symPosition) {
        const isPending = isPendingLP(symPosition)
        if (isPending) return true
      }
    }
  }

  return false
}

export const isPendingLP = (data: MemberPool): boolean => {
  const isPending =
    Number(data.assetPending) > 0 || Number(data.runePending) > 0

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
      const { pool, runeAdded, assetAdded, runePending } = memPool

      const poolChain = pool.split('.')[0] as SupportedChain
      let chainMemberData = chainMemberDetails?.[poolChain] ?? {}
      let poolMemberData = chainMemberData?.[pool] ?? {}

      // get rune asymm share & sym share
      if (Number(assetAdded) === 0 && Number(runeAdded) > 0) {
        if (Number(runePending) === 0) {
          poolMemberData = {
            ...poolMemberData,
            runeAsym: memPool,
          }
        } else {
          // if assetAdded = 0 && runePending > 0, it's pending Sym LP
          // sym share
          poolMemberData = {
            ...poolMemberData,
            sym: memPool,
          }
        }
      } else if (Number(runeAdded) > 0 && Number(assetAdded) > 0) {
        // sym share
        poolMemberData = {
          ...poolMemberData,
          sym: memPool,
        }
      }

      chainMemberData = {
        ...chainMemberData,
        [pool]: poolMemberData,
      }

      chainMemberDetails[poolChain] = chainMemberData
    })
  }

  // get only asset asym share
  if (chain !== THORChain) {
    memPools.forEach((memPool: MemberPool) => {
      const { pool, runeAdded, assetAdded, assetPending } = memPool

      const poolChain = pool.split('.')[0] as SupportedChain
      let chainMemberData = chainMemberDetails?.[poolChain] ?? {}

      let poolMemberData = chainMemberData?.[pool] ?? {}

      // check asset asymm share
      if (Number(runeAdded) === 0 && Number(assetAdded) > 0) {
        // if there's no pending Asset, it's "Asset Asym" position
        if (Number(assetPending) === 0) {
          poolMemberData = {
            ...poolMemberData,
            assetAsym: memPool,
          }
        } else {
          // if there is any pending Asset, it's "Asset + RUNE sym LP"
          // scenario is
          // Asset Sym deposit tx went through but Rune Sym deposit is not complete
          // Therefore, 'assetAdded' > 0, 'assetPending' > 0
          poolMemberData = {
            ...poolMemberData,
            sym: memPool,
          }
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
