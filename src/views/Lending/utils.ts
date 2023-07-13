import { AssetEntity as Asset, Pool } from '@thorswap-lib/swapkit-core';
import { ColorType } from 'types/app';

export const getSaverPoolNameForAsset = (asset: Asset) => {
  return `${asset.chain}.${asset.symbol}`;
};

export const getSaverPool = (asset: Asset, pools: Pool[]) => {
  return pools.find(
    (pool) => pool.detail.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
  );
};

export const getFilledColor = (value: number = 0): ColorType => {
  if (value > 90) return 'red';
  if (value > 60) return 'yellow';
  return 'green';
};

export const getFormattedPercent = (percent?: number) => {
  if (!percent) return '';

  const toFixed = percent > 100 ? 0 : percent < 10 ? 2 : 1;
  return `${percent.toFixed(toFixed)}%`;
};
