import { AssetValue } from '@swapkit/core';
import type { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { useMemo } from 'react';
import { useGetPoolsQuery } from 'store/midgard/api';

export const usePools = (period?: PoolPeriods) => {
  const { data: pools = [], isFetching: poolsLoading } = useGetPoolsQuery(period);

  const [allPoolAssets, allSynthAssets] = useMemo(
    () =>
      pools.reduce(
        (acc, { status, asset }) => {
          const [chain, symbol] = asset.split('.');
          const poolAsset = AssetValue.fromStringSync(asset) as AssetValue;
          const synthAsset = AssetValue.fromStringSync(`${chain}/${symbol}`) as AssetValue;
          const isStaged = status.toLowerCase() === 'staged';

          if (isStaged && poolAsset) {
            // @ts-expect-error
            poolAsset.type = `Staged - ${poolAsset.type}`;
          }

          if (isStaged && synthAsset) {
            // @ts-expect-error
            synthAsset.type = `Staged - ${synthAsset.type}`;
          }
          if (poolAsset) acc[0].push(poolAsset);
          if (synthAsset) acc[1].push(synthAsset);

          return acc;
        },
        [[], []] as [AssetValue[], AssetValue[]],
      ) ?? [[], []],
    [pools],
  );

  const [poolAssets, synthAssets] = useMemo(
    () => [
      allPoolAssets.filter(({ type }) => !type.includes('Staged')) ?? [],
      allSynthAssets.filter(({ type }) => !type.includes('Staged')) ?? [],
    ],
    [allPoolAssets, allSynthAssets],
  );

  return { allPoolAssets, allSynthAssets, pools, poolsLoading, synthAssets, poolAssets };
};
