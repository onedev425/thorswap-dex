import { Network } from '@thorswap-lib/midgard-sdk'
import { Amount } from '@thorswap-lib/multichain-sdk'

export const getTVL = (networkData: Network | null) => {
  // totalActiveBond + totalStandbyBond + Total Liquidity

  const totalActiveBond = Amount.fromMidgard(
    networkData?.bondMetrics.totalActiveBond,
  )
  const totalStandbyBond = Amount.fromMidgard(
    networkData?.bondMetrics.totalStandbyBond,
  )
  const totalLiquidity = Amount.fromMidgard(networkData?.totalPooledRune).mul(2)

  return totalActiveBond.add(totalStandbyBond).add(totalLiquidity)
}

export const getTotalBond = (networkData: Network | null) => {
  // totalActiveBond + totalStandbyBond
  const totalActiveBond = Amount.fromMidgard(
    networkData?.bondMetrics.totalActiveBond,
  )
  const totalStandbyBond = Amount.fromMidgard(
    networkData?.bondMetrics.totalStandbyBond,
  )

  return totalActiveBond.add(totalStandbyBond)
}

export const getTotalActiveBond = (networkData: Network | null) => {
  // totalActiveBond
  const totalActiveBond = Amount.fromMidgard(
    networkData?.bondMetrics.totalActiveBond,
  )

  return totalActiveBond
}

export const getTotalStandbyBond = (networkData: Network | null) => {
  return Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond)
}
