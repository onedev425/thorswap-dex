import type { Asset } from '@swapkit/core';
import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { RUNEAsset } from 'helpers/assets';
import { useBalance } from 'hooks/useBalance';
import { usePools } from 'hooks/usePools';
import { useEffect, useRef, useState } from 'react';

type Props = {
  includeRune?: boolean;
  assets?: Asset[];
};

export const useAssetsWithBalance = ({ assets, includeRune }: Props = {}) => {
  const loading = useRef(false);
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

    const assetPromises = filteredPools.map((pool) => {
      const asset = AssetValue.fromStringSync(pool.asset)!;

      return getMaxBalance(asset, true).then((balance) => ({ asset, balance }));
    });

    if (includeRune) {
      assetPromises.unshift(
        getMaxBalance(RUNEAsset, true).then((balance) => ({ asset: RUNEAsset, balance })),
      );
    }

    if (loading.current) return;
    loading.current = true;
    Promise.all(assetPromises).then((balancePools) => {
      setAssetsWithBalance(
        assetsMap.length > 0
          ? balancePools.filter((pool) => assetsMap.includes(pool.asset.symbol))
          : balancePools,
      );

      loading.current = true;
    });
  }, [assets, getMaxBalance, includeRune, isWalletConnected, pools]);

  return assetsWithBalance;
};
