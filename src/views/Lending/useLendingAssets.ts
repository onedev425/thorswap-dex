import type { Chain } from '@swapkit/core';
import { AssetValue } from '@swapkit/core';
import { useBalance } from 'hooks/useBalance';
import { useEffect, useState } from 'react';
import { useGetLendingAssetsQuery } from 'store/thorswap/api';
import type { LendingAsset } from 'views/Lending/types';

export function useLendingAssets() {
  const { data } = useGetLendingAssetsQuery();
  const { getMaxBalance, isWalletConnected } = useBalance();

  const [lendingAssets, setLendingAssets] = useState<LendingAsset[]>([]);

  useEffect(() => {
    if (!data) return;

    Promise.all(
      data.map(async (assetRes) => {
        const asset = AssetValue.fromStringSync(assetRes.asset)!;

        return {
          ...assetRes,
          asset,
          derivedDepthPercentage: Number(assetRes.derivedDepthPercentage),
          balance: isWalletConnected(asset.chain as Chain) ? await getMaxBalance(asset) : undefined,
          extraInfo:
            assetRes.ltvPercentage && assetRes.ltvPercentage !== 'NaN'
              ? assetRes.ltvPercentage
              : undefined,
          filled: assetRes.filledPercentage ? Number(assetRes.filledPercentage) : undefined,
          lendingAvailable: assetRes.lendingAvailable,
          ltvPercentage: assetRes.ltvPercentage,
        };
      }),
    ).then((assets) => setLendingAssets(assets.filter((asset) => asset.lendingAvailable)));
  }, [data, getMaxBalance, isWalletConnected]);

  return lendingAssets;
}
