import { QueryStatus } from '@reduxjs/toolkit/query';
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

const UNCHAINABLE_PROVIDERS = ['CHAINFLIP', 'MAYACHAIN'];

export const useTokenList = (withTradingPairs = false) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tradingPairs, setTraidingPairs] = useState<Map<string, Token[]>>(new Map());
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

    const tokensByProvider = new Map<string, Token[]>();

    if (withTradingPairs) {
      const chainableTokens = providersData
        .filter(({ data }) => {
          return !UNCHAINABLE_PROVIDERS.includes(data?.provider || '');
        })
        .reduce(
          (acc, { data, status }) =>
            !data?.tokens || status === QueryStatus.rejected
              ? acc
              : ([...acc, ...data.tokens] as Token[]),
          [] as Token[],
        );
      for (const { data, status } of providersData) {
        if (!data?.tokens || status === QueryStatus.rejected) return;
        const isProviderChainable = !UNCHAINABLE_PROVIDERS.includes(data.provider);

        for (const token of data.tokens) {
          const isUnique = providersData
            .filter((provider) => provider.data?.provider !== data.provider)
            .every(
              (pd) =>
                pd.data?.tokens && !pd.data.tokens.find((t) => t.identifier === token.identifier),
            );

          if (isUnique) {
            if (isProviderChainable) {
              tokensByProvider.set(token.identifier, chainableTokens);
            } else {
              tokensByProvider.set(token.identifier, data.tokens);
            }
          }
          //  data.tokens.forEach((token) => {
          //   const isUnique = providersData
          //     .filter((provider) => provider.data?.provider !== data.provider)
          //     .every(
          //       (pd) =>
          //         pd.data?.tokens && !pd.data.tokens.find((t) => t.identifier === token.identifier),
          //     );

          //   if (isUnique) {
          //     if (isProviderChainable) {
          //       tokensByProvider.set(token.identifier, chainableTokens);
          //     } else {
          //       tokensByProvider.set(token.identifier, data.tokens);
          //     }
          //     // if (tokensByProvider.has(token.identifier)) {
          //     //   tokensByProvider.get(token.identifier)!.push(token);
          //     // } else {
          //     //   tokensByProvider.set(token.identifier, [token]);
          //     // }
          //   }
        }
      }
    }

    setTraidingPairs(tokensByProvider);

    const tokens = providersData.reduce(
      (acc, { data, status }) =>
        !data?.tokens || status === QueryStatus.rejected
          ? acc
          : ([...acc, ...data.tokens] as Token[]),
      [] as Token[],
    );

    setTokens(tokens);
  }, [fetchTokenList, providers, withTradingPairs]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, isLoading: isFetching, tradingPairs };
};
