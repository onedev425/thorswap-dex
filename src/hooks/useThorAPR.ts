import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { usePools } from 'hooks/usePools';
import { useMemo } from 'react';

const BLOCKS_PER_DAY = 6432;

const getAPY = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER;

  const dailyROI = (blockReward * BLOCKS_PER_DAY) / totalAmount;

  return ((1 + dailyROI) ** 365 - 1) * 100;
};

export const useThorAPR = () => {
  const { pools } = usePools();

  const thorPool = useMemo(() => {
    const thorAsset = getSignatureAssetFor('ETH_THOR');

    return pools?.find(({ asset }) => thorAsset.toString() === asset);
  }, [pools]);

  const thorDepth = useMemo(() => parseFloat(thorPool?.assetDepth ?? '0') * 2, [thorPool]);
  const apy = useMemo(() => Number(thorDepth ? getAPY(0, thorDepth).toFixed(2) : 0), [thorDepth]);

  const thorchainAPY = Number(thorPool?.poolAPY ?? 0) * 100;

  return (apy + thorchainAPY).toFixed(2);
};
