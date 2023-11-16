import type { AssetValue } from '@swapkit/core';
import type { Pool } from 'legacyTypes/pool';
import type { ColorType } from 'types/app';

export const getSaverPoolNameForAsset = (asset: AssetValue) => {
  return `${asset.chain}.${asset.symbol}`;
};

// TODO Pool
export const getSaverPool = (asset: AssetValue, pools: Pool[]) => {
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
