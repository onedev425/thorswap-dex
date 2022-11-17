import { Amount, Asset, QuoteMode, QuoteRoute } from '@thorswap-lib/multichain-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetTokensQuoteQuery } from 'store/thorswap/api';

type Params = {
  affiliateBasisPoints: string;
  inputAmount: Amount;
  inputAsset: Asset;
  outputAsset: Asset;
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
  const [swapQuote, setSwapRoute] = useState<QuoteRoute>();
  const { slippageTolerance } = useApp();

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

  const {
    refetch,
    error,
    isLoading,
    currentData: data,
    isFetching,
  } = useGetTokensQuoteQuery(tokenQuoteParams, {
    skip: tokenQuoteParams.sellAmount === '0' || inputAmount.assetAmount.isZero(),
  });

  const routes = useMemo(() => {
    if (!data?.routes || inputAmount.lte(0)) return [];

    return data.routes
      .filter(Boolean)
      .concat()
      .sort(
        (a, b) =>
          Number(b.optimal) - Number(a.optimal) ||
          Number(b.expectedOutputMaxSlippage) - Number(a.expectedOutputMaxSlippage),
      );
  }, [inputAmount, data?.routes]);

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

  const quoteMode = useMemo(
    () => (selectedRoute?.meta?.quoteMode as QuoteMode) || QuoteMode.UNSUPPORTED_QUOTE,
    [selectedRoute?.meta?.quoteMode],
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
    estimatedTime: data?.estimatedTime,
    isFetching,
    minReceive,
    outputAmount,
    quoteMode,
    refetch,
    routes,
    selectedRoute,
    setSwapRoute,
  };
};
