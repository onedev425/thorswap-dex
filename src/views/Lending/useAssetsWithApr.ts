import type { AssetValue } from '@swapkit/core';
import { SwapKitNumber } from '@swapkit/core';
import { useMimir } from 'hooks/useMimir';
import { usePools } from 'hooks/usePools';
import { getFormattedPercent, getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: AssetValue[]) => {
  const { pools } = usePools();

  const { synthCap } = useMimir();

  const assetsWithAPR = assets.map((asset) => {
    const pool = pools?.find(
      (pool) => pool.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
    );

    if (pool) {
      const apr = Number(pool?.saversAPR || 0) * 100;

      const assetDepthAmount = new SwapKitNumber({
        value: pool?.assetDepth,
        decimal: asset.decimal,
      });
      const saverCap = new SwapKitNumber({ value: synthCap, decimal: 0 }).mul(assetDepthAmount);
      const filled = new SwapKitNumber({ value: pool?.synthSupply, decimal: 0 })
        .div(saverCap)
        .mul(100)
        .toFixed(2);

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
