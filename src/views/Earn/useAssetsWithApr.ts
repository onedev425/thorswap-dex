import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useMimir } from 'hooks/useMimir';
import { useEffect, useState } from 'react';
import { midgardApi } from 'services/midgard';
import { MidgardEarnPoolType } from 'store/midgard/types';
import { getFormattedPercent, getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: Asset[]) => {
  const [pools, setPools] = useState<MidgardEarnPoolType[]>([]);
  const { synthCap } = useMimir();

  useEffect(() => {
    const getPools = async () => {
      const res = await midgardApi.getPools();
      setPools(res as unknown as MidgardEarnPoolType[]);
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
      const filled = Amount.fromMidgard(pool?.synthSupply).div(saverCap).mul(100).toFixedDecimal(2);

      return {
        asset,
        apr: getFormattedPercent(apr),
        aprRaw: apr / 100,
        filled: Math.min(100, Number(filled)),
      };
    }

    return { asset };
  });

  return assetsWithAPR;
};
