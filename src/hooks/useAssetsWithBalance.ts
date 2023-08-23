import { Amount, AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { Asset, Chain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';
import { IS_PROD } from 'settings/config';
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
        return Amount.fromNormalAmount(b.detail.saversAPR)
          .sub(Amount.fromNormalAmount(a.detail.saversAPR))
          .assetAmount.toNumber();
      });
    // filter pools with respect to user balance
    const balancePools = filteredPools.map((pool: Pool) => ({
      asset: pool.asset,
      balance: isWalletConnected(pool.asset.L1Chain as Chain)
        ? getMaxBalance(pool.asset)
        : undefined,
    }));

    const avaxUsdc = AssetEntity.fromAssetString(
      'AVAX.USDC-0XB97EF9EF8734C71904D8002F8B6BC66DD9C48A6E',
    );
    const ethUsdc = AssetEntity.fromAssetString(
      'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
    );
    const ethUsdt = AssetEntity.fromAssetString(
      'ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7',
    );

    // filter pools by provided assets
    if (assetsMap.length > 0) {
      return balancePools.filter((pool) => assetsMap.includes(pool.asset.symbol));
    }
    return balancePools.concat(
      // @ts-expect-error
      IS_PROD ? [] : [{ asset: avaxUsdc }, { asset: ethUsdc }, { asset: ethUsdt }],
    );
  }, [assets, getMaxBalance, isWalletConnected, pools]);

  return assetsWithBalance;
};
