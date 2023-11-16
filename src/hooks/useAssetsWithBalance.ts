import type { Asset } from '@swapkit/core';
import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useBalance } from 'hooks/useBalance';
import { usePools } from 'hooks/usePools';
import { useEffect, useState } from 'react';

export const useAssetsWithBalance = (assets?: Asset[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { pools } = usePools();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    { asset: AssetValue; balance?: AssetValue }[]
  >([]);

  useEffect(() => {
    const assetsMap = assets?.map((asset) => asset.symbol) || [];
    const filteredPools =
      pools
        ?.filter((pool) => pool.saversDepth !== '0')
        .sort((a, b) => {
          return new SwapKitNumber({ value: b.runeDepth, decimal: 8 })
            .sub(a.runeDepth)
            .getValue('number');
        }) || [];

    Promise.all(
      filteredPools.map((pool) => {
        const asset = AssetValue.fromStringSync(pool.asset)!;

        return getMaxBalance(asset, true).then((balance) => ({ asset, balance }));
      }),
    ).then((balancePools) =>
      setAssetsWithBalance(
        assetsMap.length > 0
          ? balancePools.filter((pool) => assetsMap.includes(pool.asset.symbol))
          : balancePools,
      ),
    );
  }, [assets, getMaxBalance, isWalletConnected, pools]);

  return assetsWithBalance;
};
