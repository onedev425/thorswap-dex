import type { Asset } from '@swapkit/core';
import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { RUNEAsset } from 'helpers/assets';
import { useBalance } from 'hooks/useBalance';
import { useDebouncedCallback } from 'hooks/useDebouncedValue';
import { usePools } from 'hooks/usePools';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  includeRune?: boolean;
  assets?: Asset[];
};

export const useAssetsWithBalance = ({ assets, includeRune }: Props = {}) => {
  const { getMaxBalance } = useBalance();
  const { pools } = usePools();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    { asset: AssetValue; balance?: AssetValue }[]
  >([]);

  const assetsMap = useMemo(() => assets?.map((asset) => asset.symbol) || [], [assets]);

  const handleAssetsWithBalanceSet = useDebouncedCallback(
    (balances: { asset: AssetValue; balance?: AssetValue }[]) => setAssetsWithBalance(balances),
    500,
  );

  const handleAssetSet = useCallback(
    async (pools: { asset: string }[]) => {
      const poolsToMaxBalance = includeRune ? [...pools, { asset: RUNEAsset.toString() }] : pools;

      const poolsPromises = poolsToMaxBalance.map(async (pool) => {
        const asset = AssetValue.fromStringSync(pool.asset)!;
        const balance = await getMaxBalance(asset, true);

        return { asset, balance };
      });

      const poolsWithBalance = await Promise.all(poolsPromises);

      const filteredBalances =
        assetsMap.length > 0
          ? poolsWithBalance.filter((pool) => assetsMap.includes(pool.asset.symbol))
          : poolsWithBalance;

      handleAssetsWithBalanceSet(filteredBalances);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetsMap, getMaxBalance, includeRune],
  );

  useEffect(() => {
    const filteredPools =
      pools
        ?.filter((pool) => pool.saversDepth !== '0')
        .sort((a, b) => {
          return new SwapKitNumber({ value: b.runeDepth, decimal: 8 })
            .sub(a.runeDepth)
            .getValue('number');
        }) || [];

    handleAssetSet(filteredPools);
  }, [handleAssetSet, pools]);

  return assetsWithBalance;
};
