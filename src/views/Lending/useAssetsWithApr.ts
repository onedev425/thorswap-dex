import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { useMimir } from 'hooks/useMimir';
import { usePools } from 'hooks/usePools';
import { getFormattedPercent, getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: Asset[]) => {
  const { pools } = usePools();

  const { synthCap } = useMimir();

  const assetsWithAPR = assets.map((asset) => {
    const pool = pools?.find(
      (pool) => pool.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
    );

    if (pool) {
      const apr = Number(pool?.saversAPR || 0) * 100;

      const assetDepthAmount = Amount.fromMidgard(pool?.assetDepth);
      const saverCap = Amount.fromNormalAmount(synthCap).mul(assetDepthAmount);
      const filled = Amount.fromMidgard(pool?.synthSupply)
        .div(saverCap)
        .mul(100)
        .toFixedDecimal(2);

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
