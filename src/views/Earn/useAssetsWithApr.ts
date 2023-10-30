import { Amount } from '@thorswap-lib/swapkit-core';
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

        const assetDepthAmount = Amount.fromMidgard(pool.assetDepth);
        const saverCap = Amount.fromNormalAmount(synthCap).mul(assetDepthAmount);
        const filled = Amount.fromMidgard(pool.synthSupply)
          .div(saverCap)
          .mul(100)
          .toFixedDecimal(2);

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
