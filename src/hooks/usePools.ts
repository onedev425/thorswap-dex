import { AssetValue } from '@swapkit/core';
import { useMemo } from 'react';
import { useGetPoolsQuery } from 'store/midgard/api';
import type { PoolsPeriod } from 'store/midgard/types';

export const usePools = (period?: PoolsPeriod) => {
  const { data: pools = [], isLoading: poolsLoading } = useGetPoolsQuery(period);

  const [poolAssets, synthAssets] = useMemo(
    () =>
      pools
        ?.filter(({ status }) => status.toLowerCase() === 'available')
        .reduce(
          (acc, { asset }) => {
            const [chain, symbol] = asset.split('.');
            acc[0].push(AssetValue.fromStringSync(asset) as AssetValue);
            acc[1].push(AssetValue.fromStringSync(`${chain}/${symbol}`) as AssetValue);

            return acc;
          },
          [[], []] as [AssetValue[], AssetValue[]],
        ) ?? [[], []],
    [pools],
  );

  return { pools, poolsLoading, synthAssets, poolAssets };
};
