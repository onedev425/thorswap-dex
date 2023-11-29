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

  const { inputUnitPrice, outputUnitPrice } = useMemo(() => {
    const inputIdentifier = assets?.[0]?.toString(assets?.[0]?.isSynthetic) || '';
    const outputIdentifier = assets?.[1]?.toString(assets?.[1]?.isSynthetic) || '';

    return {
      inputUnitPrice: tokenPricesPerIdentifier[inputIdentifier]?.price_usd || 0,
      outputUnitPrice: tokenPricesPerIdentifier[outputIdentifier]?.price_usd || 0,
    };
  }, [assets, tokenPricesPerIdentifier]);

  return {
    inputUnitPrice,
    outputUnitPrice,
    data: tokenPricesPerIdentifier,
    refetch,
    isLoading: isLoading || isFetching,
  } as const;
};
