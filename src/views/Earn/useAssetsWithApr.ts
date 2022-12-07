import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { useMimir } from 'hooks/useMimir';
import { useEffect, useState } from 'react';
import { getEarnMidgardPools } from 'store/midgard/actions';
import { MidgardEarnPoolType } from 'store/midgard/types';
import { getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: Asset[]) => {
  //TODO - use midgard from redux when data will be available in the api (soon)
  const [pools, setPools] = useState<MidgardEarnPoolType[]>([]);
  const { synthCap } = useMimir();

  useEffect(() => {
    const getPools = async () => {
      const res = await getEarnMidgardPools();
      setPools(res);
    };

    getPools();
  }, []);

  const assetsWithAPR = assets.map((asset) => {
    const pool = pools.find(
      (pool) => pool.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
    );

    if (pool) {
      const apr = Number(pool?.saversAPR || 0) * 100;

      const assetDepthAmount = Amount.fromMidgard(pool.assetDepth);
      const saverCap = Amount.fromNormalAmount(synthCap).mul(assetDepthAmount);
      const filled = Amount.fromMidgard(pool?.synthSupply).div(saverCap).mul(100);

      return {
        asset,
        apr: apr ? `${apr.toFixed(2)}%` : '',
        filled: filled.gt(100) ? '100%' : `${filled.toFixed(2)}%`,
      };
    }

    return { asset, apr: '', filled: '' };
  });

  return assetsWithAPR;
};
