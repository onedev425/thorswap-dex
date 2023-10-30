import { Amount } from '@thorswap-lib/swapkit-core';
import { parseToPercent } from 'helpers/parseHelpers';
import { useGetNetworkQuery, useGetStatsQuery } from 'store/midgard/api';
import type { NetworkResponse } from 'store/midgard/types';

const getTotalBond = (networkData?: NetworkResponse) => {
  // totalActiveBond + totalStandbyBond
  const totalActiveBond = Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);
  const totalStandbyBond = Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);

  return totalActiveBond.add(totalStandbyBond);
};

const getTVL = (networkData?: NetworkResponse) => {
  // totalActiveBond + totalStandbyBond + Total Liquidity

  const totalActiveBond = Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);
  const totalStandbyBond = Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);
  const totalLiquidity = Amount.fromMidgard(networkData?.totalPooledRune).mul(2);

  return totalActiveBond.add(totalStandbyBond).add(totalLiquidity);
};

const getTotalStandbyBond = (networkData?: NetworkResponse) =>
  Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);

const getTotalActiveBond = (networkData?: NetworkResponse) =>
  Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);

export const useGlobalStats = () => {
  const { data: stats } = useGetStatsQuery();
  const { data: networkData } = useGetNetworkQuery();

  const totalBond = getTotalBond(networkData);
  const tvlInRune = getTVL(networkData);
  const totalActiveBond = getTotalActiveBond(networkData);
  const totalStandbyBond = getTotalStandbyBond(networkData);

  const bondingAPYLabel = parseToPercent(networkData?.bondingAPY ?? 0);
  const liquidityAPYLabel = parseToPercent(networkData?.liquidityAPY ?? 0);

  const swapVolume = Amount.fromMidgard(stats?.swapVolume);
  const addLiquidityVolume = Amount.fromMidgard(stats?.addLiquidityVolume);
  const withdrawVolume = Amount.fromMidgard(stats?.withdrawVolume);

  const swapCount = Amount.fromNormalAmount(stats?.swapCount);
  const addLiquidityCount = Amount.fromNormalAmount(stats?.addLiquidityCount);
  const withdrawCount = Amount.fromNormalAmount(stats?.withdrawCount);

  const totalVolume = swapVolume.add(addLiquidityVolume).add(withdrawVolume);
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount);

  return {
    totalBond,
    tvlInRune,
    totalActiveBond,
    totalStandbyBond,
    liquidityAPYLabel,
    swapVolume,
    addLiquidityVolume,
    withdrawVolume,
    totalVolume,
    networkData,
    bondingAPYLabel,
    totalTx,
  };
};
