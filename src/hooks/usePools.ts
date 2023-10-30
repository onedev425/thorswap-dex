import type { Chain } from '@thorswap-lib/swapkit-core';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
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
            acc[0].push(new AssetEntity(chain as Chain, symbol));
            acc[1].push(new AssetEntity(chain as Chain, symbol, true));

            return acc;
          },
          [[], []] as [AssetEntity[], AssetEntity[]],
        ) ?? [[], []],
    [pools],
  );

  return { pools, poolsLoading, synthAssets, poolAssets };
};
