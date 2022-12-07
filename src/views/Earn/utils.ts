import { Asset, Pool } from '@thorswap-lib/multichain-core';
import { ColorType } from 'types/app';

export function getSaverPoolNameForAsset(asset: Asset): string {
  return `${asset.chain}.${asset.symbol}`;
}

export function getSaverPool(asset: Asset, pools: Pool[]): Pool | undefined {
  return pools.find(
    (pool) => pool.detail.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
  );
}

export function getFilledColor(value?: string): ColorType {
  const numValue = Number(value?.replace('%', ''));
  if (numValue > 90) {
    return 'red';
  }

  if (numValue > 60) {
    return 'yellow';
  }

  return 'green';
}
