import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useMimir } from 'hooks/useMimir';
import { useMidgard } from 'store/midgard/hooks';
import { getFormattedPercent, getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useAssetsWithApr = (assets: Asset[]) => {
  const { pools: periodPools } = useMidgard();
  const pools = periodPools['7d'];

  const { synthCap } = useMimir();

  const assetsWithAPR = assets.map((asset) => {
    const pool = pools.find(
      (pool) => pool.detail.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
    );

    if (pool) {
      const apr = Number(pool?.detail.saversAPR || 0) * 100;

      const assetDepthAmount = Amount.fromMidgard(pool?.detail.assetDepth);
      const saverCap = Amount.fromNormalAmount(synthCap).mul(assetDepthAmount);
      const filled = Amount.fromMidgard(pool?.detail.synthSupply)
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
