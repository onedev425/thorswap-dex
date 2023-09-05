import { QueryStatus } from '@reduxjs/toolkit/query';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_LEDGER_LIVE, IS_PROD } from 'settings/config';
import { useLazyGetTokenListQuery } from 'store/static/api';
import { useAppSelector } from 'store/store';
import { useGetProvidersQuery } from 'store/thorswap/api';
import type { Token } from 'store/thorswap/types';

/**
 * Leave this as easy to navigate and clear as possible.
 */
export const DISABLED_TOKENLIST_PROVIDERS = IS_PROD
  ? []
  : IS_LEDGER_LIVE
  ? ['Stargatearb', 'Pancakeswap', 'Pancakeswapeth', 'Traderjoe', 'Pangolin']
  : [];

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
      .filter((p) => ![...disabledProviders, ...DISABLED_TOKENLIST_PROVIDERS].includes(p));
  }, [disabledProviders, providersData]);

  const fetchTokens = useCallback(async () => {
    if (!providers.length) return;

    const providerRequests = providers.map(async (provider) => fetchTokenList(provider));

    const providersData = await Promise.all(providerRequests);
    const tokens = providersData
      .reduce(
        (acc, { data, status }) =>
          !data?.tokens || status === QueryStatus.rejected
            ? acc
            : ([...acc, ...data.tokens] as Token[]),
        [] as Token[],
      )
      // TODO (BSC): Remove this filter after release
      .filter((token) => (IS_PROD && token.chain !== Chain.BinanceSmartChain) || !IS_PROD);

    setTokens(tokens);
  }, [fetchTokenList, providers]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, isLoading: isFetching };
};
