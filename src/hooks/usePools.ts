import { AssetValue } from '@swapkit/core';
import type { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { useMemo } from 'react';
import { useGetPoolsQuery } from 'store/midgard/api';

export const usePools = (period?: PoolPeriods) => {
  const { data: pools = [], isFetching: poolsLoading } = useGetPoolsQuery(period);

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
