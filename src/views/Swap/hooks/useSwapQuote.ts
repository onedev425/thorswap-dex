import { Amount, Asset, QuoteMode, QuoteRoute } from '@thorswap-lib/multichain-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetSupportedProvidersQuery, useGetTokensQuoteQuery } from 'store/thorswap/api';

type Params = {
  inputAmount: Amount;
  inputAsset: Asset;
  outputAsset: Asset;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
};

export const useSwapQuote = ({
  inputAmount,
  inputAsset,
  outputAsset,
  recipientAddress,
  senderAddress,
  skipAffiliate,
}: Params) => {
  const [swapQuote, setSwapRoute] = useState<QuoteRoute>();
  const { slippageTolerance } = useApp();

  const { data: supportedProvidersData, isLoading: supportedProvidersLoading } =
    useGetSupportedProvidersQuery();

  const params = useMemo(
    () => ({
      affiliateBasisPoints: skipAffiliate ? '0' : undefined,
      providers: supportedProvidersData,
      sellAsset: inputAsset.toString(),
      buyAsset: outputAsset.toString(),
      slippage: slippageTolerance.toString(),
      sellAmount: inputAmount.assetAmount.toString(),
      senderAddress,
      recipientAddress,
    }),
    [
      skipAffiliate,
      senderAddress,
      recipientAddress,
      inputAmount.assetAmount,
      inputAsset,
      outputAsset,
      slippageTolerance,
      supportedProvidersData,
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
    skip:
      tokenQuoteParams.sellAmount === '0' ||
      inputAmount.assetAmount.isZero() ||
      supportedProvidersLoading ||
      !supportedProvidersData?.length,
  });

  const routes = useMemo(() => {
    if (!data?.routes || inputAmount.lte(0)) return [];

    return data.routes
      .concat()
      .sort(
        (a, b) =>
          Number(b.optimal) - Number(a.optimal) ||
          Number(b.expectedOutputMaxSlippage) - Number(a.expectedOutputMaxSlippage),
      );
  }, [inputAmount, data?.routes]);

  const selectedRoute = useMemo(
    () => (error || isLoading ? undefined : swapQuote) || routes[0],
    [error, isLoading, routes, swapQuote],
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
      setSwapRoute(routes[0]);
    }
  }, [error, routes, selectedRoute]);

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
