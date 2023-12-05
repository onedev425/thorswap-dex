import { SwapKitNumber } from '@swapkit/core';
import { useMimir } from 'hooks/useMimir';
import { usePools } from 'hooks/usePools';
import { useMemo } from 'react';
import { getFormattedPercent } from 'views/Earn/utils';

export const useAssetsWithApr = () => {
  const { pools } = usePools('7d');
  const { synthCap } = useMimir();

  const assetsWithAPR = useMemo(() => {
    const filteredPools = pools.filter(
      (pool) => pool.saversDepth !== '0' && pool.saversUnits !== '0',
    );
    return filteredPools
      .map((pool) => {
        const apr = Number(pool.saversAPR || 0) * 100;
        const assetDepthAmount = SwapKitNumber.fromBigInt(BigInt(pool.assetDepth), 8);
        const saverCap = assetDepthAmount.mul(synthCap);
        const synthSupply = SwapKitNumber.fromBigInt(BigInt(pool.synthSupply), 8);
        const filled = saverCap.gt(0) ? Number(synthSupply.div(saverCap).mul(100).toFixed(2)) : 0;

        return {
          apr: getFormattedPercent(apr),
          aprRaw: apr / 100,
          asset: pool.asset,
          filled: Math.min(100, Number(filled)),
        };
      })
      .sort((a, b) => b.filled - a.filled);
  }, [synthCap, pools]);

  return assetsWithAPR;
};
