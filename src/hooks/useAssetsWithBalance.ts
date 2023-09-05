import type { Pool } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import type { Asset, Chain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const useAssetsWithBalance = (assets?: Asset[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();

  const assetsWithBalance = useMemo(() => {
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
    const balancePools = filteredPools.map((pool: Pool) => ({
      asset: pool.asset,
      balance: isWalletConnected(pool.asset.L1Chain as Chain)
        ? getMaxBalance(pool.asset)
        : undefined,
    }));

    // filter pools by provided assets
    if (assetsMap.length > 0) {
      return balancePools.filter((pool) => assetsMap.includes(pool.asset.symbol));
    }
    return balancePools;
  }, [assets, getMaxBalance, isWalletConnected, pools]);

  return assetsWithBalance;
};
