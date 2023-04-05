import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { getOutOufPocketFee } from 'hooks/useRouteFees';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';
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

  useEffect(() => {
    if (!data?.routes || inputAmount.lte(0)) return setRoutes([]);

    setApprovalsLoading(true);
    try {
      const routesWithApprovePromise = data.routes.map(async (route) => {
        const { isApproved } = await checkApprove({ asset: inputAsset, contract: route.contract });

        return { ...route, isApproved };
      });

      Promise.all(routesWithApprovePromise).then((routesWithApprove) => {
        const sortedRoutes = routesWithApprove
          .filter(Boolean)
          .concat()
          .sort((a, b) => {
            const isOptimal = Number(b.optimal) - Number(a.optimal) > 0;
            const aValue = Number(a.expectedOutputMaxSlippageUSD);
            const bValue = Number(b.expectedOutputMaxSlippageUSD);

            const aSlippValue = a.isApproved ? aValue + getOutOufPocketFee(a.fees) : aValue;
            const bSlippValue = b.isApproved ? bValue + getOutOufPocketFee(b.fees) : bValue;
            const slippDiff = bSlippValue - aSlippValue;

            const feeDiff =
              slippDiff === 0 ? getOutOufPocketFee(b.fees) - getOutOufPocketFee(a.fees) : 0;

            return slippDiff || feeDiff || (isOptimal ? 1 : -1);
          });

        setRoutes(sortedRoutes);
      });
    } finally {
      setApprovalsLoading(false);
    }
  }, [checkApprove, data?.routes, inputAmount, inputAsset]);

  const selectedRoute = useMemo(
    () =>
      (error || isLoading || inputAmount.assetAmount.isZero() ? undefined : swapQuote) || routes[0],
    [error, inputAmount.assetAmount, isLoading, routes, swapQuote],
  );

  const outputAmount: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        selectedRoute && !inputAmount.eq(0) ? selectedRoute.expectedOutput : 0,
        outputAsset.decimal,
      ),
    [selectedRoute, outputAsset, inputAmount],
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
  };
};
