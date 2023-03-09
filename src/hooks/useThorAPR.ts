import { AssetEntity as Asset, Pool } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

const BLOCKS_PER_DAY = 6432;

const getAPY = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER;

  const dailyROI = (blockReward * BLOCKS_PER_DAY) / totalAmount;

  return ((1 + dailyROI) ** 365 - 1) * 100;
};

export const useThorAPR = () => {
  const { pools } = useMidgard();

  const thorPool = useMemo(() => Pool.byAsset(Asset.THOR(), pools), [pools]);
  const thorDepth = useMemo(
    () => (thorPool?.assetDepth.assetAmount.toNumber() ?? 0) * 2,
    [thorPool],
  );

  const apy = useMemo(() => Number(thorDepth ? getAPY(0, thorDepth).toFixed(2) : 0), [thorDepth]);
  const thorchainAPY = Number(thorPool?.detail?.poolAPY ?? 0) * 100;

  return (apy + thorchainAPY).toFixed(2);
};
