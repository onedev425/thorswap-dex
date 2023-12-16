import type { AssetValue, SwapKitNumber } from '@swapkit/core';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useVTHORBalance } from 'hooks/useHasVTHOR';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_BETA, IS_LEDGER_LIVE, IS_LOCAL } from 'settings/config';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';
import type { GetTokensQuoteResponse } from 'store/thorswap/types';
import { checkAssetApprove } from 'views/Swap/hooks/useIsAssetApproved';

type Params = {
  inputAsset: AssetValue;
  inputAmount: SwapKitNumber;
  ethAddress?: string;
  outputAsset: AssetValue;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
  inputUSDPrice: number;
};

export const useSwapQuote = ({
  ethAddress,
  inputAsset,
  inputAmount,
  outputAsset,
  recipientAddress,
  senderAddress,
  inputUSDPrice,
}: Params) => {
  const [approvalsLoading, setApprovalsLoading] = useState<boolean>(false);
  const [swapQuote, setSwapRoute] = useState<RouteWithApproveType>();
  const [routes, setRoutes] = useState<RouteWithApproveType[]>([]);

  const VTHORBalance = useVTHORBalance(ethAddress);

  const affiliateBasisPoints = useMemo(() => {
    let basisPoints = 30;

    if (VTHORBalance.gte(1_000)) basisPoints = 25;
    if (VTHORBalance.gte(10_000)) basisPoints = 15;
    if (VTHORBalance.gte(100_000)) basisPoints = 10;
    if (VTHORBalance.gte(500_000)) basisPoints = 0;

    if (IS_LEDGER_LIVE) basisPoints = 50;
    if (IS_BETA || IS_LOCAL) basisPoints = 0;

    if (inputUSDPrice >= 1_000_000) basisPoints /= 2;

    return `${Math.floor(basisPoints)}`;
  }, [VTHORBalance, inputUSDPrice]);

  const params = useMemo(
    () => ({
      affiliateBasisPoints,
      sellAsset: inputAsset.isSynthetic ? inputAsset.symbol : inputAsset.toString(),
      buyAsset: outputAsset.isSynthetic ? outputAsset.symbol : outputAsset.toString(),
      sellAmount: inputAmount.getValue('string'),
      senderAddress,
      recipientAddress,
    }),
    [affiliateBasisPoints, inputAsset, outputAsset, inputAmount, senderAddress, recipientAddress],
  );

  const {
    refetch,
    error,
    isLoading,
    currentData: data,
    isFetching,
  } = useGetTokensQuoteQuery(params, {
    skip: params.sellAmount === '0' || inputAmount.lte(0),
  });

  const setSortedRoutes = useCallback(
    async (routes: GetTokensQuoteResponse['routes']) => {
      try {
        const routesWithApprovePromise = routes.map(async (route) => {
          const isApproved = senderAddress
            ? await checkAssetApprove({
                assetValue: inputAsset.mul(0).add(inputAmount),
                contract: route.approvalTarget || route.allowanceTarget || route.targetAddress,
              })
            : true;

          return { ...route, isApproved };
        });

        const routesWithApprove = await Promise.all(routesWithApprovePromise);

        const sortedRoutes = routesWithApprove
          .filter(Boolean)
          .concat()
          .sort((a, b) => {
            const approveDiff = Number(b.isApproved) - Number(a.isApproved);
            if (approveDiff !== 0) return approveDiff;
            if (b.optimal && !a.optimal) return 1;
            if (!b.optimal && a.optimal) return -1;
            return 0;
          }) as RouteWithApproveType[];

        setRoutes(sortedRoutes);
      } finally {
        setApprovalsLoading(false);
      }
    },

    [inputAsset, senderAddress, inputAmount],
  );

  const isInputZero = useMemo(() => inputAmount.lte(0), [inputAmount]);

  useEffect(() => {
    if (!data?.routes || isInputZero) return setRoutes([]);

    setSortedRoutes(data.routes);

    setApprovalsLoading(true);
  }, [data?.routes, isInputZero, setSortedRoutes]);

  const selectedRoute: RouteWithApproveType | undefined = useMemo(
    () =>
      error || isLoading || inputAmount.getValue('number') === 0
        ? undefined
        : swapQuote || routes[0],
    [error, inputAmount, isLoading, routes, swapQuote],
  );

  useEffect(() => {
    if (!error) {
      const route = routes.find(
        (r) => JSON.stringify(r.providers) === JSON.stringify(selectedRoute?.providers),
      );
      setSwapRoute(route || routes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, routes]);

  return {
    affiliateBasisPoints,
    vTHORDiscount: !IS_LEDGER_LIVE && VTHORBalance.gte(1_000),
    error,
    estimatedTime: selectedRoute?.estimatedTime,
    isFetching: approvalsLoading || isLoading || isFetching,
    refetch,
    routes,
    selectedRoute,
    setSwapRoute,
    quoteId: data?.quoteId,
  };
};
