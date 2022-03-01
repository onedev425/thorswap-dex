import { Percent, Amount } from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import { getTVL, getTotalBond, getTotalActiveBond } from 'helpers/network'

export const useGlobalStats = () => {
  const { stats, networkData, volume24h } = useMidgard()

  const totalBond = getTotalBond(networkData)
  const tvlInRune = getTVL(networkData)
  const totalActiveBond = getTotalActiveBond(networkData)

  const bondingAPYLabel = new Percent(networkData?.bondingAPY ?? 0).toFixed(2)
  const liquidityAPYLabel = new Percent(networkData?.liquidityAPY ?? 0).toFixed(
    2,
  )

  const swapVolume = Amount.fromMidgard(stats?.swapVolume)
  const addLiquidityVolume = Amount.fromMidgard(stats?.addLiquidityVolume)
  const withdrawVolume = Amount.fromMidgard(stats?.withdrawVolume)

  const swapCount = Amount.fromNormalAmount(stats?.swapCount)
  const addLiquidityCount = Amount.fromNormalAmount(stats?.addLiquidityCount)
  const withdrawCount = Amount.fromNormalAmount(stats?.withdrawCount)

  const totalVolume = swapVolume.add(addLiquidityVolume).add(withdrawVolume)
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount)

  return {
    totalBond,
    tvlInRune,
    totalActiveBond,
    liquidityAPYLabel,
    swapVolume,
    addLiquidityVolume,
    withdrawVolume,
    totalVolume,
    volume24h,
    networkData,
    bondingAPYLabel,
    totalTx,
  }
}
