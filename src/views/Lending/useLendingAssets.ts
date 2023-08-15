import { AssetEntity as Asset, Chain } from '@thorswap-lib/swapkit-core';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';
import { useGetLendingAssetsQuery } from 'store/thorswap/api';
import { LendingAsset } from 'views/Lending/types';

export function useLendingAssets() {
  const { data } = useGetLendingAssetsQuery();
  const { getMaxBalance, isWalletConnected } = useBalance();

  const lendingAssets: LendingAsset[] = useMemo(() => {
    if (!data) return [];
    return data
      .map((assetRes) => {
        const asset = Asset.fromAssetString(assetRes.asset) as Asset;

        return {
          ...assetRes,
          asset,
          derivedDepthPercentage: Number(assetRes.derivedDepthPercentage),
          balance: isWalletConnected(asset.L1Chain as Chain) ? getMaxBalance(asset) : undefined,
          extraInfo: assetRes.loanCr,
          filled: assetRes.filledPercentage ? Number(assetRes.filledPercentage) : undefined,
          lendingAvailable: assetRes.lendingAvailable,
        };
      })
      .filter((asset) => asset.lendingAvailable);
  }, [data, getMaxBalance, isWalletConnected]);

  return lendingAssets;
}
