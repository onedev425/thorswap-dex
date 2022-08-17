import { useEffect, useMemo, useState } from 'react'

import {
  Amount,
  Asset,
  QuoteMode,
  QuoteRoute,
} from '@thorswap-lib/multichain-sdk'
import deepEqual from 'fast-deep-equal'

import { useApp } from 'store/app/hooks'
import {
  useGetSupportedProvidersQuery,
  useGetTokensQuoteQuery,
} from 'store/pathfinder/api'

import { useDebouncedValue } from 'hooks/useDebounceValue'
import usePrevious from 'hooks/usePrevious'

type Params = {
  inputAsset: Asset
  inputAmount: Amount
  outputAsset: Asset
  senderAddress?: string
  recipientAddress?: string
}

export const useSwapQuote = ({
  inputAsset,
  outputAsset,
  inputAmount,
  senderAddress,
  recipientAddress,
}: Params) => {
  const [swapQuote, setSwapRoute] = useState<QuoteRoute>()
  const { slippageTolerance } = useApp()

  const { data: supportedProvidersData, isLoading: supportedProvidersLoading } =
    useGetSupportedProvidersQuery()

  const params = useMemo(
    () => ({
      // affiliateBasisPoints: 0,
      providers: supportedProvidersData,
      sellAsset: inputAsset.toString(),
      buyAsset: outputAsset.toString(),
      slippage: slippageTolerance.toString(),
      sellAmount: inputAmount.assetAmount.toString(),
      senderAddress,
      recipientAddress,
    }),
    [
      senderAddress,
      recipientAddress,
      inputAmount.assetAmount,
      inputAsset,
      outputAsset,
      slippageTolerance,
      supportedProvidersData,
    ],
  )

  const tokenQuoteParams = useDebouncedValue(params, 300)

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
  })

  const routes = useMemo(() => {
    if (!data?.routes || inputAmount.lte(0)) return []

    return data.routes
      .concat()
      .sort(
        (a, b) =>
          Number(b.optimal) - Number(a.optimal) ||
          Number(b.expectedOutputMaxSlippage) -
            Number(a.expectedOutputMaxSlippage),
      )
  }, [inputAmount, data?.routes])

  const previousRoutes = usePrevious(routes)

  const selectedRoute = useMemo(
    () => (error || isLoading ? undefined : swapQuote) || routes[0],
    [error, isLoading, routes, swapQuote],
  )

  const outputAmount: Amount = useMemo(
    () =>
      selectedRoute && !inputAmount.eq(0)
        ? Amount.fromAssetAmount(
            selectedRoute.expectedOutput,
            outputAsset.decimal,
          )
        : Amount.fromAssetAmount(0, 8),
    [selectedRoute, outputAsset, inputAmount],
  )

  const minReceive: Amount = useMemo(
    () =>
      selectedRoute
        ? Amount.fromAssetAmount(
            selectedRoute.expectedOutputMaxSlippage,
            outputAsset.decimal,
          )
        : Amount.fromAssetAmount(0, 8),
    [selectedRoute, outputAsset],
  )

  const quoteMode = useMemo(
    () =>
      // @ts-expect-error cross-chain-api-sdk
      (selectedRoute?.meta?.quoteMode as QuoteMode) ||
      QuoteMode.UNSUPPORTED_QUOTE,
    // @ts-expect-error cross-chain-api-sdk
    [selectedRoute?.meta?.quoteMode],
  )

  useEffect(() => {
    if (!error && !deepEqual(routes, previousRoutes)) {
      setSwapRoute(routes[0])
    }
  }, [error, previousRoutes, routes, selectedRoute])

  return {
    quoteMode,
    isFetching,
    minReceive,
    outputAmount,
    selectedRoute,
    refetch,
    routes,
    setSwapRoute,
  }
}
