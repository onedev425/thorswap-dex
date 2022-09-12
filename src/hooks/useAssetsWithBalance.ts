import { Asset } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';

export const useAssetsWithBalance = (assets: Asset[]) => {
  const { getMaxBalance, isWalletConnected } = useBalance();

  const assetsWithBalance = useMemo(
    () =>
      assets.map((asset: Asset) => ({
        asset,
        balance: isWalletConnected(asset.L1Chain as SupportedChain)
          ? getMaxBalance(asset)
          : undefined,
      })),
    [assets, getMaxBalance, isWalletConnected],
  );

  return assetsWithBalance;
};
