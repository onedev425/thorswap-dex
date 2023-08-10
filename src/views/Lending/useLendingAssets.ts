import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useGetLendingAssetsQuery } from 'store/thorswap/api';

export function useLendingAssets() {
  const { data } = useGetLendingAssetsQuery();

  const lendingAssets = useMemo(() => {
    if (!data) return [];
    return data
      .map((assetStr) => Asset.fromAssetString(assetStr))
      .filter((a): a is Asset => a !== null);
  }, [data]);

  return {
    hasLendingAssets: !!data?.length,
    lendingAssets,
  };
}
