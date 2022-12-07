import { Asset } from '@thorswap-lib/multichain-core';
import { useEffect, useState } from 'react';
import { getEarnMidgardPools } from 'store/midgard/actions';
import { MidgardEarnPoolType } from 'store/midgard/types';
import { getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: Asset[]) => {
  //TODO - use midgard from redux when data will be available in the api (soon)
  const [pools, setPools] = useState<MidgardEarnPoolType[]>([]);

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
    const apr = Number(pool?.saversAPR || 0) * 100;

    return {
      asset,
      apr: apr ? `${apr.toFixed(2)}%` : '',
    };
  });

  return assetsWithAPR;
};
