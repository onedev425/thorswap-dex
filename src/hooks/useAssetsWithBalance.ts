import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';

export const useAssetsWithBalance = (assets: AssetEntity[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();

  const assetsWithBalance = useMemo(
    () =>
      assets.map((asset: AssetEntity) => ({
        asset,
        balance: isWalletConnected(asset.L1Chain as Chain) ? getMaxBalance(asset) : undefined,
      })),
    [assets, getMaxBalance, isWalletConnected],
  );

  return assetsWithBalance;
};
