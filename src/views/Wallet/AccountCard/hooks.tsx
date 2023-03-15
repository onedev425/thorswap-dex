import { AssetAmount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { parseAssetToToken } from 'helpers/parseAssetToToken';
import { useMemo } from 'react';
import { useGetTokenCachedPricesQuery } from 'store/thorswap/api';

export type TokenParam = { asset: Asset; amount: BigNumber };

export const useTokenPrices = (chainInfo: AssetAmount[]) => {
  const tokens = useMemo(() => chainInfo.map(({ asset }) => parseAssetToToken(asset)), [chainInfo]);

  const { data, refetch, isLoading, isFetching } = useGetTokenCachedPricesQuery({
    tokens,
    options: { includeMetadata: true },
  });

  return { data, refetch, isLoading: isLoading || isFetching } as const;
};
