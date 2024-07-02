import { QueryStatus } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IS_LEDGER_LIVE, IS_PROD } from "settings/config";
import { useLazyGetTokenListQuery } from "store/static/api";
import { useAppSelector } from "store/store";
import { useGetProvidersQuery } from "store/thorswap/api";
import type { Token } from "store/thorswap/types";

export enum Provider {
  V1_PROVIDERS = "V1_PROVIDERS",
  CHAINFLIP = "CHAINFLIP",
  MAYACHAIN = "MAYACHAIN",
}

/**
 * Leave this as easy to navigate and clear as possible.
 */
export const DISABLED_TOKENLIST_PROVIDERS = IS_PROD
  ? []
  : IS_LEDGER_LIVE
    ? ["Stargatearb", "Pancakeswap", "Pancakeswapeth", "Traderjoe", "Pangolin"]
    : [];

const UNCHAINABLE_PROVIDERS = ["CHAINFLIP", "MAYACHAIN"];

export const useTokenList = (withTradingPairs = false) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tradingPairs, setTraidingPairs] = useState<
    Map<
      string,
      {
        tokens: Token[];
        providers: Provider[];
      }
    >
  >(new Map());
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

    const tokensByProvider = new Map<
      string,
      {
        tokens: Token[];
        providers: Provider[];
      }
    >();

    if (withTradingPairs) {
      const chainableTokens = providersData
        .filter(({ data }) => {
          return !UNCHAINABLE_PROVIDERS.includes(data?.provider || "");
        })
        .reduce(
          (acc, { data, status }) =>
            !data?.tokens || status === QueryStatus.rejected
              ? acc
              : (acc.concat(data.tokens) as Token[]),
          [] as Token[],
        );
      for (const { data, status } of providersData) {
        if (!data?.tokens || status === QueryStatus.rejected) return;
        const isProviderChainable = !UNCHAINABLE_PROVIDERS.includes(data.provider);

        for (const token of data.tokens) {
          const existingTradingPairs = tokensByProvider.get(token.identifier.toLowerCase()) || {
            tokens: [],
            providers: [],
          };

          const tradingPairs = isProviderChainable
            ? { tokens: chainableTokens, providers: [Provider.V1_PROVIDERS] }
            : { tokens: data.tokens, providers: [data.provider as Provider] };

          tokensByProvider.set(token.identifier.toLowerCase(), {
            tokens: existingTradingPairs.tokens.concat(tradingPairs.tokens),
            providers: existingTradingPairs.providers.concat(tradingPairs.providers),
          });
        }
      }
    }

    setTraidingPairs(tokensByProvider);

    const tokens = providersData.reduce((acc, { data, status }) => {
      if (!data?.tokens || status === QueryStatus.rejected) {
        return acc;
      }

      // add tokenlist param missing from api
      const dataTokens = data.tokens.map((token) => ({ ...token, provider: data.provider }));
      return acc.concat(dataTokens);
    }, [] as Token[]);

    setTokens(tokens);
  }, [fetchTokenList, providers, withTradingPairs]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, isLoading: isFetching, tradingPairs };
};
