import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { getOutOfPocketFee } from 'hooks/useRouteFees';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_PROTECTED } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';
import { GetTokensQuoteResponse } from 'store/thorswap/types';
import { useAssetApprovalCheck } from 'views/Swap/hooks/useIsAssetApproved';

type Params = {
  affiliateBasisPoints: string;
  inputAmount: Amount;
  inputAsset: AssetEntity;
  outputAsset: AssetEntity;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
};

export const useSwapQuote = ({
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
            const approveStatusDiff = Number(b.isApproved) - Number(a.isApproved);

            if (!approveStatusDiff) {
              const aAfterFee = Number(a.expectedOutputUSD) - getOutOfPocketFee(a.fees);
              const bAfterFee = Number(b.expectedOutputUSD) - getOutOfPocketFee(b.fees);
              const valueDiff = bAfterFee - aAfterFee;

              return valueDiff || (b.optimal ? 1 : -1);
            }

            return approveStatusDiff;
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

  const selectedRoute = useMemo(
    () =>
      (error || isLoading || inputAmount.assetAmount.isZero() ? undefined : swapQuote) || routes[0],
    [error, inputAmount.assetAmount, isLoading, routes, swapQuote],
  );

  const outputAmount: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        selectedRoute && !inputAmount.eq(0)
          ? streamSwap && selectedRoute.streamingSwap?.expectedOutput
            ? selectedRoute.streamingSwap?.expectedOutput
            : selectedRoute.expectedOutput
          : 0,
        outputAsset.decimal,
      ),
    [selectedRoute, inputAmount, streamSwap, outputAsset.decimal],
  );

  const minReceive: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        selectedRoute ? selectedRoute.expectedOutputMaxSlippage : 0,
        outputAsset.decimal,
      ),
    [selectedRoute, outputAsset],
  );

  useEffect(() => {
    if (!error) {
      const route = routes.find(
        (r) => JSON.stringify(r.providers) === JSON.stringify(selectedRoute.providers),
      );
      setSwapRoute(route || routes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, routes]);

  const toggleStreamSwap = useCallback(
    (enabled: boolean) => {
      if (enabled && selectedRoute?.calldata?.memoStreamingSwap) {
        setStreamSwap(true);
        return;
      }

      setStreamSwap(false);
    },
    [selectedRoute?.calldata?.memoStreamingSwap],
  );

  useEffect(() => {
    toggleStreamSwap(streamSwap);
  }, [selectedRoute, streamSwap, toggleStreamSwap]);

  return {
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
    canStreamSwap: IS_PROTECTED && !!selectedRoute?.calldata?.memoStreamingSwap,
  };
};
