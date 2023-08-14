import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { useMemo } from 'react';
import { useGetTokenCachedPricesQuery } from 'store/thorswap/api';
import { GetTokenPriceResponse } from 'store/thorswap/types';
export type TokenParam = { asset: Asset; amount: BigNumber };

export const useTokenPrices = (
  assets?: Asset[],
  {
    pollingInterval,
    lookup,
    sparkline,
  }: { pollingInterval?: number; sparkline?: boolean; lookup?: boolean } = {},
) => {
  const tokens = useMemo(() => assets?.map(parseAssetToToken) || [], [assets]);

  const { data, refetch, isLoading, isFetching } = useGetTokenCachedPricesQuery(
    { tokens, options: { metadata: true, sparkline, lookup } },
    { skip: !tokens.length, pollingInterval },
  );

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
