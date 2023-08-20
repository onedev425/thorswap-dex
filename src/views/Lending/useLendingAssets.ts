import { Chain } from '@thorswap-lib/swapkit-core';
import { BTCAsset, ETHAsset } from 'helpers/assets';
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
        const asset = assetRes.asset.includes('ETH') ? ETHAsset : BTCAsset;

        return {
          ...assetRes,
          asset,
          derivedDepthPercentage: Number(assetRes.derivedDepthPercentage),
          balance: isWalletConnected(asset.L1Chain as Chain) ? getMaxBalance(asset) : undefined,
          extraInfo:
            assetRes.ltvPercentage && assetRes.ltvPercentage !== 'NaN'
              ? `${assetRes.ltvPercentage}%`
              : undefined,
          filled: assetRes.filledPercentage ? Number(assetRes.filledPercentage) : undefined,
          lendingAvailable: assetRes.lendingAvailable,
          ltvPercentage: assetRes.ltvPercentage,
        };
      })
      .filter((asset) => asset.lendingAvailable);
  }, [data, getMaxBalance, isWalletConnected]);

  return lendingAssets;
}
