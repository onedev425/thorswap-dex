import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyGetTokenListQuery } from 'store/static/api';
import { useAppSelector } from 'store/store';
import { useGetProvidersQuery } from 'store/thorswap/api';
import { Token } from 'store/thorswap/types';

export const useTokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const { data: providersData } = useGetProvidersQuery();
  const [fetchTokenList, { isFetching }] = useLazyGetTokenListQuery();
  const disabledProviders = useAppSelector(
    ({ assets: { disabledTokenLists } }) => disabledTokenLists,
  );

  const providers = useMemo(() => {
    if (!providersData) return [];

    return providersData
      .map(({ provider }) => provider)
      .filter((p) => !disabledProviders.includes(p));
  }, [disabledProviders, providersData]);

  const fetchTokens = useCallback(async () => {
    if (!providers.length) return;

    const providerRequests = providers.map(async (provider) => fetchTokenList(provider));

    const providersData = await Promise.all(providerRequests);
    const tokens = providersData.reduce(
      (acc, { data, status }) =>
        !data?.tokens || status === QueryStatus.rejected
          ? acc
          : ([...acc, ...data.tokens] as Token[]),
      [] as Token[],
    );

    setTokens(tokens);
  }, [fetchTokenList, providers]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, isLoading: isFetching };
};
