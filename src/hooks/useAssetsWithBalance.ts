import type { AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import type { Asset } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useEffect, useState } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const useAssetsWithBalance = (assets?: Asset[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    { asset: AssetEntity; balance: Amount | undefined }[]
  >([]);

  useEffect(() => {
    const assetsMap = assets?.map((asset) => asset.symbol) || [];
    // filter pools for savers and sort by APR
    const filteredPools = pools
      .filter((pool) => pool.detail.saversDepth !== '0')
      .sort((a, b) => {
        return Amount.fromNormalAmount(b.detail.runeDepth)
          .sub(Amount.fromNormalAmount(a.detail.runeDepth))
          .assetAmount.toNumber();
      });
    // filter pools with respect to user balance
    Promise.all(
      filteredPools.map((pool: Pool) =>
        getMaxBalance(pool.asset, true).then((balance) => ({
          asset: pool.asset,
          balance,
        })),
      ),
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
