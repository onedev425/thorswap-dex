import { type AssetValue, SwapKitNumber } from '@swapkit/core';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useVTHORBalance } from 'hooks/useHasVTHOR';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_BETA, IS_LEDGER_LIVE, IS_LOCAL } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';
import type { GetTokensQuoteResponse } from 'store/thorswap/types';
import { checkAssetApprove } from 'views/Swap/hooks/useIsAssetApproved';

type Params = {
  inputAsset: AssetValue;
  inputAmount: SwapKitNumber;
  noPriceProtection: boolean;
  ethAddress?: string;
  outputAsset: AssetValue;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
  inputUSDPrice: number;
};

export const useSwapQuote = ({
  ethAddress,
  noPriceProtection,
  inputAsset,
  inputAmount,
  outputAsset,
  recipientAddress,
  senderAddress,
  inputUSDPrice,
}: Params) => {
  const { slippageTolerance } = useApp();
  const [approvalsLoading, setApprovalsLoading] = useState<boolean>(false);
  const [swapQuote, setSwapRoute] = useState<RouteWithApproveType>();
  const [routes, setRoutes] = useState<RouteWithApproveType[]>([]);
  const [streamSwap, setStreamSwap] = useState(false);
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
      slippage: slippageTolerance.toString(),
      sellAmount: inputAmount.getValue('string'),
      senderAddress,
      recipientAddress,
    }),
    [
      affiliateBasisPoints,
      inputAsset,
      outputAsset,
      slippageTolerance,
      inputAmount,
      senderAddress,
      recipientAddress,
    ],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputAsset.toString()],
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

  const canStreamSwap = useMemo(
    () => !noPriceProtection && !!selectedRoute?.calldata?.memoStreamingSwap,
    [noPriceProtection, selectedRoute?.calldata?.memoStreamingSwap],
  );

  const outputAmount = useMemo(() => {
    const value =
      selectedRoute && !(inputAmount.getValue('number') === 0)
        ? streamSwap && selectedRoute?.streamingSwap?.expectedOutput
          ? selectedRoute.streamingSwap.expectedOutput
          : selectedRoute.expectedOutput
        : 0;

    return new SwapKitNumber({ value, decimal: outputAsset.decimal });
  }, [selectedRoute, inputAmount, streamSwap, outputAsset.decimal]);

  const minReceive = useMemo(
    () =>
      new SwapKitNumber({
        value:
          (streamSwap && selectedRoute?.streamingSwap?.expectedOutputMaxSlippage) ||
          selectedRoute?.expectedOutputMaxSlippage ||
          0,
        decimal: outputAsset.decimal,
      }),
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
    affiliateBasisPoints,
    vTHORDiscount: !IS_LEDGER_LIVE && VTHORBalance.gte(1_000),
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
