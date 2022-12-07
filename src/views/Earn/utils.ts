import { Asset, Pool } from '@thorswap-lib/multichain-core';

export function getSaverPoolNameForAsset(asset: Asset): string {
  return `${asset.chain}.${asset.symbol}`;
}

export function getSaverPool(asset: Asset, pools: Pool[]): Pool | undefined {
  return pools.find(
    (pool) => pool.detail.asset.toLowerCase() === getSaverPoolNameForAsset(asset).toLowerCase(),
  );
}
