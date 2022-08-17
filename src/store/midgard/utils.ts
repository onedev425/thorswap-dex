import {
  MemberPool,
  LpDetail,
  WithdrawDetail,
  StakeDetail,
} from '@thorswap-lib/midgard-sdk'
import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain, SupportedChain } from '@thorswap-lib/types'
import { BigNumber } from 'bignumber.js'
import isEmpty from 'lodash/isEmpty'

import {
  ChainMemberDetails,
  LiquidityProvider,
  PoolMemberData,
  LpDetailCalculationResult,
} from './types'

export const hasPendingLP = (data: ChainMemberDetails | undefined): boolean => {
  if (!data) return false

  const chainMemberDataArray = Object.values(data)

  if (!chainMemberDataArray) return false

  for (let i = 0; i < chainMemberDataArray.length; i++) {
    const chainMemberData = chainMemberDataArray?.[i] ?? {}
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

export const checkPendingLP = (data: LiquidityProvider): boolean => {
  if (Number(data.pending_asset) > 0 || Number(data.pending_rune) > 0) {
    return true
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
  chainMemberDetails, // previous chain member details
}: {
  chain: SupportedChain
  memPools: MemberPool[]
  chainMemberDetails: ChainMemberDetails
}): ChainMemberDetails => {
  // get sym and rune asym share from memPools fetched with thorchain address
  if (chain === Chain.THORChain) {
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

  // get sym and asset asym share
  if (chain !== Chain.THORChain) {
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

export const mergePendingLP = ({
  pendingLP,
  chainMemberDetails,
}: {
  pendingLP: LiquidityProvider
  chainMemberDetails: ChainMemberDetails
}): ChainMemberDetails => {
  const chain = Asset.fromAssetString(pendingLP.asset)?.chain

  if (!chain) return chainMemberDetails

  const chainMemberData = chainMemberDetails?.[chain] ?? {}

  let poolMemberData: PoolMemberData = {}
  Object.keys(chainMemberData).forEach((poolIndex) => {
    if (poolIndex === pendingLP.asset) {
      poolMemberData = chainMemberData[poolIndex]
    }
  })

  const pendingMemberPool: MemberPool = {
    assetAdded: pendingLP.asset_deposit_value,
    assetAddress: pendingLP.asset_address || '',
    assetPending: pendingLP.pending_asset,
    assetWithdrawn: '0',
    dateFirstAdded: '-',
    dateLastAdded: '-',
    liquidityUnits: pendingLP.units,
    pool: pendingLP.asset,
    runeAdded: pendingLP.rune_deposit_value,
    runeAddress: pendingLP.rune_address || '',
    runeWithdrawn: '0',
    runePending: pendingLP.pending_rune,
  }

  poolMemberData = {
    ...poolMemberData,
    pending: pendingMemberPool,
  }

  chainMemberData[pendingLP.asset] = poolMemberData
  chainMemberDetails[chain] = chainMemberData

  return chainMemberDetails
}

export const removePendingLP = ({
  asset,
  chainMemberDetails,
}: {
  asset: string
  chainMemberDetails: ChainMemberDetails
}): ChainMemberDetails => {
  const chain = Asset.fromAssetString(asset)?.chain

  if (!chain) return chainMemberDetails

  const chainMemberData = chainMemberDetails?.[chain] ?? {}

  let poolMemberData: PoolMemberData = {}
  Object.keys(chainMemberData).forEach((poolIndex) => {
    if (poolIndex === asset) {
      poolMemberData = chainMemberData[poolIndex]
    }
  })

  if (!isEmpty(poolMemberData)) {
    poolMemberData = {
      ...poolMemberData,
      pending: undefined,
    }

    chainMemberData[asset] = poolMemberData
    chainMemberDetails[chain] = chainMemberData
  }

  return chainMemberDetails
}

export const getAddedAndWithdrawn = (
  lpDetails: LpDetail[],
): LpDetailCalculationResult => {
  const baseNumber = Math.pow(10, 8) // 1e8
  const calculated: LpDetailCalculationResult = {}

  lpDetails.forEach(({ stakeDetail, withdrawDetail, pool }: LpDetail) => {
    const totalAdded = stakeDetail.reduce(
      (total: { rune: number; asset: number }, staked: StakeDetail) => {
        const assetAdded = new BigNumber(staked.assetAmount).div(baseNumber)

        const runeAdded = new BigNumber(staked.runeAmount).div(baseNumber)

        return {
          asset: total.asset + assetAdded.toNumber(),
          rune: total.rune + runeAdded.toNumber(),
        }
      },
      { rune: 0, asset: 0 },
    )

    const totalWithdrawn = withdrawDetail.reduce(
      (total: { rune: number; asset: number }, withdrawn: WithdrawDetail) => {
        const assetWithdrawn = new BigNumber(withdrawn.assetAmount).div(
          baseNumber,
        )

        const runeWithdrawn = new BigNumber(withdrawn.runeAmount).div(
          baseNumber,
        )

        return {
          asset: total.asset + assetWithdrawn.toNumber(),
          rune: total.rune + runeWithdrawn.toNumber(),
        }
      },
      { rune: 0, asset: 0 },
    )
    calculated[pool] = { added: totalAdded, withdrawn: totalWithdrawn }
  })

  return calculated
}
