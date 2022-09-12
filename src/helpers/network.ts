import type { Network as MidgardNetwork } from '@thorswap-lib/midgard-sdk';
import { Amount } from '@thorswap-lib/multichain-core';

export const getTVL = (networkData: MidgardNetwork | null) => {
  // totalActiveBond + totalStandbyBond + Total Liquidity

  const totalActiveBond = Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);
  const totalStandbyBond = Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);
  const totalLiquidity = Amount.fromMidgard(networkData?.totalPooledRune).mul(2);

  return totalActiveBond.add(totalStandbyBond).add(totalLiquidity);
};

export const getTotalBond = (networkData: MidgardNetwork | null) => {
  // totalActiveBond + totalStandbyBond
  const totalActiveBond = Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);
  const totalStandbyBond = Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);

  return totalActiveBond.add(totalStandbyBond);
};

export const getTotalActiveBond = (networkData: MidgardNetwork | null) => {
  // totalActiveBond
  const totalActiveBond = Amount.fromMidgard(networkData?.bondMetrics.totalActiveBond);

  return totalActiveBond;
};

export const getTotalStandbyBond = (networkData: MidgardNetwork | null) => {
  return Amount.fromMidgard(networkData?.bondMetrics.totalStandbyBond);
};
