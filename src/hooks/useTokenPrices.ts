import type { AssetValue } from '@swapkit/core';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { useMemo } from 'react';
import { useGetTokenCachedPricesQuery } from 'store/thorswap/api';
import type { GetTokenPriceResponse } from 'store/thorswap/types';
export type TokenParam = { assetValue: AssetValue };

export const useTokenPrices = (
  assets?: AssetValue[],
  { lookup, sparkline }: { pollingInterval?: number; sparkline?: boolean; lookup?: boolean } = {},
) => {
  const tokens = useMemo(() => assets?.map(parseAssetToToken) || [], [assets]);

  const params = useMemo(
    () => ({ tokens, options: { metadata: true, sparkline, lookup } }),
    [tokens, sparkline, lookup],
  );

  const { data, refetch, isLoading, isFetching } = useGetTokenCachedPricesQuery(params);

  const tokenPricesPerIdentifier = useMemo(() => {
    if (!data) return {};

    return data.reduce(
      (acc, { identifier, ...rest }) => {
        if (!identifier) return acc;

        acc[identifier] = rest;
        return acc;
      },
      {} as Record<string, GetTokenPriceResponse[number]>,
    );
  }, [data]);

  return { data: tokenPricesPerIdentifier, refetch, isLoading: isLoading || isFetching } as const;
};
