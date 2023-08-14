import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useCallback, useMemo } from 'react';
import { useGetLendingAssetsQuery } from 'store/thorswap/api';

export function useLendingAssets() {
  const { data } = useGetLendingAssetsQuery();

  const lendingAssets = useMemo(() => {
    if (!data) return [];
    return data
      .map((assetStr) => Asset.fromAssetString(assetStr))
      .filter((a): a is Asset => a !== null);
  }, [data]);

  // TODO - CR FROM API
  const getAssetCR = useCallback((_asset: Asset) => {
    return 15;
  }, []);

  return {
    hasLendingAssets: !!data?.length,
    lendingAssets,
    getAssetCR,
  };
}
