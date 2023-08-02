import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';
import { GetTokensQuoteResponse } from 'store/thorswap/types';
import { useAssetApprovalCheck } from 'views/Swap/hooks/useIsAssetApproved';

type Params = {
  affiliateBasisPoints: string;
  inputAmount: Amount;
  inputAsset: AssetEntity;
  noPriceProtection: boolean;
  outputAsset: AssetEntity;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
};

export const useSwapQuote = ({
  noPriceProtection,
  affiliateBasisPoints,
  inputAmount,
  inputAsset,
  outputAsset,
  recipientAddress,
  senderAddress,
}: Params) => {
  const [approvalsLoading, setApprovalsLoading] = useState<boolean>(false);
  const [swapQuote, setSwapRoute] = useState<RouteWithApproveType>();
  const { slippageTolerance } = useApp();
  const [routes, setRoutes] = useState<RouteWithApproveType[]>([]);
  const [streamSwap, setStreamSwap] = useState(false);

  const params = useMemo(
    () => ({
      affiliateBasisPoints,
      sellAsset: inputAsset.toString(),
      buyAsset: outputAsset.toString(),
      slippage: slippageTolerance.toString(),
      sellAmount: inputAmount.assetAmount.toString(),
      senderAddress,
      recipientAddress,
    }),
    [
      affiliateBasisPoints,
      inputAsset,
      outputAsset,
      slippageTolerance,
      inputAmount.assetAmount,
      senderAddress,
      recipientAddress,
    ],
  );

  const tokenQuoteParams = useDebouncedValue(params, 300);
  const checkApprove = useAssetApprovalCheck();

  const {
    refetch,
    error,
    isLoading,
    currentData: data,
    isFetching,
  } = useGetTokensQuoteQuery(tokenQuoteParams, {
    skip: tokenQuoteParams.sellAmount === '0' || inputAmount.assetAmount.isZero(),
  });

  const setSortedRoutes = useCallback(
    async (routes: GetTokensQuoteResponse['routes']) => {
      try {
        const routesWithApprovePromise = routes.map(async (route) => {
          const isApproved = await checkApprove({
            amount: inputAmount,
            asset: inputAsset,
            contract: route.approvalTarget || route.allowanceTarget || route.targetAddress,
          });

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
    [checkApprove, inputAmount, inputAsset],
  );

  useEffect(() => {
    if (!data?.routes || inputAmount.lte(0)) return setRoutes([]);

    setSortedRoutes(data.routes);

    setApprovalsLoading(true);
  }, [checkApprove, data?.routes, inputAmount, inputAsset, setSortedRoutes]);

  const selectedRoute: RouteWithApproveType | undefined = useMemo(
    () =>
      error || isLoading || inputAmount.assetAmount.isZero() ? undefined : swapQuote || routes[0],
    [error, inputAmount.assetAmount, isLoading, routes, swapQuote],
  );

  const canStreamSwap = useMemo(
    () => !noPriceProtection && !!selectedRoute?.calldata?.memoStreamingSwap,
    [noPriceProtection, selectedRoute?.calldata?.memoStreamingSwap],
  );

  const outputAmount: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        selectedRoute && !inputAmount.eq(0)
          ? streamSwap && selectedRoute?.streamingSwap?.expectedOutput
            ? selectedRoute.streamingSwap.expectedOutput
            : selectedRoute.expectedOutput
          : 0,
        outputAsset.decimal,
      ),
    [selectedRoute, inputAmount, streamSwap, outputAsset.decimal],
  );

  const minReceive: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        (streamSwap && selectedRoute?.streamingSwap?.expectedOutputMaxSlippage) ||
          selectedRoute?.expectedOutputMaxSlippage ||
          0,
        outputAsset.decimal,
      ),
    [
      streamSwap,
      selectedRoute?.streamingSwap?.expectedOutputMaxSlippage,
      selectedRoute?.expectedOutputMaxSlippage,
      outputAsset.decimal,
    ],
  );

  const selectedRouteFees = useMemo(() => {
    if (streamSwap && selectedRoute?.streamingSwap?.fees) {
      return selectedRoute?.fees
        ? { ...selectedRoute.fees, ...selectedRoute.streamingSwap.fees }
        : selectedRoute.streamingSwap.fees;
    }

    return selectedRoute?.fees;
  }, [selectedRoute?.fees, selectedRoute?.streamingSwap?.fees, streamSwap]);

  useEffect(() => {
    if (!error) {
      const route = routes.find(
        (r) => JSON.stringify(r.providers) === JSON.stringify(selectedRoute?.providers),
      );
      setSwapRoute(route || routes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, routes]);

  const toggleStreamSwap = useCallback(
    (enabled: boolean) => setStreamSwap(enabled && !!canStreamSwap),
    [canStreamSwap],
  );

  useEffect(() => {
    // reset stream swap state only when path changed
    toggleStreamSwap(!!selectedRoute?.path);
  }, [selectedRoute?.path, toggleStreamSwap]);

  return {
    error,
    estimatedTime: selectedRoute?.estimatedTime,
    isFetching: approvalsLoading || isLoading || isFetching,
    minReceive,
    outputAmount,
    refetch,
    routes,
    selectedRoute,
    setSwapRoute,
    quoteId: data?.quoteId,
    streamSwap,
    toggleStreamSwap,
    canStreamSwap,
    selectedRouteFees,
  };
};
