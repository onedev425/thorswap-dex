import { SwapKitNumber } from "@swapkit/sdk";
import { parseToPercent } from "helpers/parseHelpers";
import { useGetHistorySwapsQuery, useGetNetworkQuery, useGetStatsQuery } from "store/midgard/api";
import type { NetworkResponse } from "store/midgard/types";
import { parseBaseValueToNumber } from "views/Home/GlobalChart";

const getTotalBond = (networkData?: NetworkResponse) => {
  // totalActiveBond + totalStandbyBond
  const totalActiveBond = SwapKitNumber.fromBigInt(
    BigInt(networkData?.bondMetrics.totalActiveBond || 0),
    8,
  );
  const totalStandbyBond = SwapKitNumber.fromBigInt(
    BigInt(networkData?.bondMetrics.totalStandbyBond || 0),
    8,
  );

  return totalActiveBond.add(totalStandbyBond);
};

const getTVL = (networkData?: NetworkResponse) => {
  // totalActiveBond + totalStandbyBond + Total Liquidity

  const totalActiveBond = SwapKitNumber.fromBigInt(
    BigInt(networkData?.bondMetrics.totalActiveBond || 0),
    8,
  );
  const totalStandbyBond = SwapKitNumber.fromBigInt(
    BigInt(networkData?.bondMetrics.totalStandbyBond || 0),
    8,
  );
  const totalLiquidity = SwapKitNumber.fromBigInt(BigInt(networkData?.totalPooledRune || 0), 8).mul(
    2,
  );

  return totalActiveBond.add(totalStandbyBond).add(totalLiquidity);
};

const getTotalStandbyBond = (networkData?: NetworkResponse) =>
  SwapKitNumber.fromBigInt(BigInt(networkData?.bondMetrics.totalStandbyBond || 0), 8);

const getTotalActiveBond = (networkData?: NetworkResponse) =>
  SwapKitNumber.fromBigInt(BigInt(networkData?.bondMetrics.totalActiveBond || 0), 8);

export const useGlobalStats = () => {
  const { data: stats } = useGetStatsQuery();
  const { data: networkData } = useGetNetworkQuery();
  const { data: swapGlobalHistory } = useGetHistorySwapsQuery({});

  const totalBond = getTotalBond(networkData);
  const tvlInRune = getTVL(networkData);
  const totalActiveBond = getTotalActiveBond(networkData);
  const totalStandbyBond = getTotalStandbyBond(networkData);

  const bondingAPYLabel = parseToPercent(networkData?.bondingAPY ?? 0);
  const liquidityAPYLabel = parseToPercent(networkData?.liquidityAPY ?? 0);

  const swapCount = new SwapKitNumber(stats?.swapCount || 0);
  const addLiquidityCount = new SwapKitNumber(stats?.addLiquidityCount || 0);
  const withdrawCount = new SwapKitNumber(stats?.withdrawCount || 0);

  const totalVolume = parseBaseValueToNumber(swapGlobalHistory?.meta.totalVolumeUsd);
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount);

  return {
    totalBond,
    tvlInRune,
    totalActiveBond,
    totalStandbyBond,
    liquidityAPYLabel,
    totalVolume,
    networkData,
    bondingAPYLabel,
    totalTx,
  };
};
