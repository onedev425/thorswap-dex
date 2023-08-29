import { Amount } from '@thorswap-lib/swapkit-core';
import { useMimir } from 'hooks/useMimir';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';
import { getFormattedPercent } from 'views/Earn/utils';

export const useAssetsWithApr = () => {
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState('7d');

  const { synthCap } = useMimir();

  const assetsWithAPR = useMemo(() => {
    const filteredPools = pools.filter(
      (pool) => pool.detail.saversDepth !== '0' && pool.detail.saversDepth !== '0',
    );
    return filteredPools
      .map((pool) => {
        const apr = Number(pool.detail.saversAPR || 0) * 100;

        const assetDepthAmount = Amount.fromMidgard(pool.detail.assetDepth);
        const saverCap = Amount.fromNormalAmount(synthCap).mul(assetDepthAmount);
        const filled = Amount.fromMidgard(pool.detail.synthSupply)
          .div(saverCap)
          .mul(100)
          .toFixedDecimal(2);

        return {
          asset: pool.asset,
          apr: getFormattedPercent(apr),
          aprRaw: apr / 100,
          filled: Math.min(100, Number(filled)),
        };
      })
      .sort((a, b) => b.filled - a.filled);
  }, [synthCap, pools]);

  return assetsWithAPR;
};
