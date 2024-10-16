import { AssetValue, type PoolDetail } from "@swapkit/sdk";
import { useMemo } from "react";
import type { POOLS_TIME_PERIODS_OPTIONS } from "settings/pools";
import { useGetPoolsQuery } from "store/midgard/api";

const emptyPools: PoolDetail[] = [];

export const usePools = (period?: (typeof POOLS_TIME_PERIODS_OPTIONS)[number]) => {
  const { data: pools = emptyPools, isFetching: poolsLoading } = useGetPoolsQuery(period);

  const [allPoolAssets, allSynthAssets] = useMemo(
    () =>
      pools.reduce(
        (acc, { status, asset }) => {
          const [chain, symbol] = asset.split(".");
          const poolAsset = AssetValue.from({ asset });
          const synthAsset = AssetValue.from({ asset: `THOR.${chain}/${symbol}` });
          const isStaged = status.toLowerCase() === "staged";

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
      allPoolAssets.filter(({ type }) => !type.includes("Staged")) ?? [],
      allSynthAssets.filter(({ type }) => !type.includes("Staged")) ?? [],
    ],
    [allPoolAssets, allSynthAssets],
  );

  return { allPoolAssets, allSynthAssets, pools, poolsLoading, synthAssets, poolAssets };
};
