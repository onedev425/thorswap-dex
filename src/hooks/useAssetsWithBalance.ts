import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Asset } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { usePools } from 'hooks/usePools';
import { useEffect, useState } from 'react';

export const useAssetsWithBalance = (assets?: Asset[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { pools } = usePools();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    { asset: AssetEntity; balance: Amount | undefined }[]
  >([]);

  useEffect(() => {
    const assetsMap = assets?.map((asset) => asset.symbol) || [];
    // filter pools for savers and sort by APR
    const filteredPools =
      pools
        ?.filter((pool) => pool.saversDepth !== '0')
        .sort((a, b) => {
          return Amount.fromNormalAmount(b.runeDepth)
            .sub(Amount.fromNormalAmount(a.runeDepth))
            .assetAmount.toNumber();
        }) || [];
    // filter pools with respect to user balance
    Promise.all(
      filteredPools.map((pool) => {
        const asset = AssetEntity.fromAssetString(pool.asset) as AssetEntity;

        return getMaxBalance(asset, true).then((balance) => ({ asset, balance }));
      }),
    ).then((balancePools) => {
      // filter pools by provided assets
      if (assetsMap.length > 0) {
        setAssetsWithBalance(balancePools.filter((pool) => assetsMap.includes(pool.asset.symbol)));
        return;
      }
      setAssetsWithBalance(balancePools);
    });
  }, [assets, getMaxBalance, isWalletConnected, pools]);

  return assetsWithBalance;
};
