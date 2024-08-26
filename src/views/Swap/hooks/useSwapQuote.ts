import type { QuoteResponseRoute, SwapKitNumber } from "@swapkit/sdk";
import { AssetValue, FeeTypeEnum, ProviderName } from "@swapkit/sdk";
import type { RouteWithApproveType } from "components/SwapRouter/types";
import { THORSWAP_AFFILIATE_ADDRESS, THORSWAP_AFFILIATE_ADDRESS_LL } from "config/constants";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useVTHORBalance } from "hooks/useHasVTHOR";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IS_BETA, IS_LEDGER_LIVE, IS_LOCAL } from "settings/config";
import { useApp } from "store/app/hooks";
import { useAppSelector } from "store/store";
import { useGetV2QuoteQuery } from "store/thorswap/api";
import type { GetTokensQuoteResponse } from "store/thorswap/types";
import { checkAssetApprove } from "views/Swap/hooks/useIsAssetApproved";
import { reduceV2StreamingRoutes } from "views/Swap/utils/reduceV2StreamingRoutes";

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
  const showingQuoteError = useRef(false);
  const { slippageTolerance } = useApp();
  const iframeData = useAppSelector(({ app }) => app.iframeData);
  const [approvalsLoading, setApprovalsLoading] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [routes, setRoutes] = useState<RouteWithApproveType[]>([]);

  const debouncedManualSlippage = useDebouncedValue(slippageTolerance, 1000);
  const debouncedSellAmount = useDebouncedValue(inputAmount.getValue("string"), 400);

  const VTHORBalance = useVTHORBalance(ethAddress);

  useEffect(() => {
    setSelectedProvider([]);
  }, [inputAmount]);

  const setSwapRoute = (route: RouteWithApproveType) => {
    // @ts-expect-error
    setSelectedProvider(route.providers || route.provider);
  };

  const affiliateBasisPoints = useMemo(() => {
    if (iframeData?.fee) return `${Math.floor(iframeData.fee)}`;

    let basisPoints = 50;

    if (VTHORBalance.gte(1_000)) basisPoints = 42;
    if (VTHORBalance.gte(10_000)) basisPoints = 25;
    if (VTHORBalance.gte(100_000)) basisPoints = 17;
    if (VTHORBalance.gte(500_000)) basisPoints = 0;

    if (IS_LEDGER_LIVE) basisPoints = 50;
    if (IS_BETA || IS_LOCAL) basisPoints = 0;

    if (inputUSDPrice >= 1_000_000) basisPoints * 0.75;

    return `${Math.floor(basisPoints)}`;
  }, [VTHORBalance, iframeData?.fee, inputUSDPrice]);

  const params = useMemo(
    () => ({
      affiliateBasisPoints,
      affiliateAddress:
        iframeData?.address ||
        (IS_LEDGER_LIVE ? THORSWAP_AFFILIATE_ADDRESS_LL : THORSWAP_AFFILIATE_ADDRESS),
      sellAsset: inputAsset.toString(),
      buyAsset: outputAsset.toString(),
      sellAmount: debouncedSellAmount,
      senderAddress,
      recipientAddress,
      ...(debouncedManualSlippage && {
        slippage: debouncedManualSlippage.toString(),
      }),
    }),
    [
      affiliateBasisPoints,
      debouncedManualSlippage,
      debouncedSellAmount,
      iframeData?.address,
      inputAsset,
      outputAsset,
      recipientAddress,
      senderAddress,
    ],
  );

  const {
    refetch,
    error,
    isLoading,
    currentData: data,
    isFetching,
    isUninitialized,
  } = useGetV2QuoteQuery(
    {
      ...{
        ...params,
        sellAsset: inputAsset.toString({ includeSynthProtocol: true }),
        buyAsset: outputAsset.toString({ includeSynthProtocol: true }),
      },
    },
    {
      skip: params.sellAmount === "0" || inputAmount.lte(0),
    },
  );

  const quoteError = useMemo(() => error, [error]);

  const refetchAllQuotes = useMemo(
    () => () => {
      setRoutes([]);
      if (!isUninitialized) {
        refetch();
      }
    },
    [isUninitialized, refetch],
  );

  const setSortedRoutes = useCallback(
    async (routes: GetTokensQuoteResponse["routes"]) => {
      try {
        const routesWithApprovePromise = routes.map(async (route) => {
          const isApproved =
            senderAddress && !route.providers.includes(ProviderName.CHAINFLIP)
              ? await checkAssetApprove({
                  assetValue: inputAsset.set(inputAmount),
                  contract:
                    // @ts-expect-error
                    route.meta.approvalAddress ||
                    route.approvalTarget ||
                    route.allowanceTarget ||
                    route.targetAddress ||
                    route.providers[0].toLowerCase(),
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
            return (
              Number(b.streamingSwap?.expectedOutput || b.expectedOutput) -
              Number(a.streamingSwap?.expectedOutput || a.expectedOutput)
            );
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
    if (isFetching && !!routes.length) {
      return;
    }

    const filteredRoutes = (data?.routes || [])
      .filter((route) => {
        const streamingProvider = route.providers.find((provider) => /.*_STREAMING/.test(provider));
        if (!streamingProvider) return true;

        const nonStreamingProvider = streamingProvider.replace("_STREAMING", "");
        const nonStreamingRoute = data?.routes.find((r) =>
          r.providers.includes(nonStreamingProvider as ProviderName),
        );

        return !(
          nonStreamingRoute && route.expectedBuyAmount === nonStreamingRoute.expectedBuyAmount
        );
      })
      .map((route: QuoteResponseRoute) => {
        const meta = route.meta;

        const v2Fees = route?.fees?.reduce(
          (acc, fee) => {
            const assetPriceUsd =
              meta.assets?.find(
                (assetMetaData) => assetMetaData.asset.toLowerCase() === fee.asset.toLowerCase(),
              )?.price || 0;

            if (fee.type === FeeTypeEnum.INBOUND) {
              const inboundFee = AssetValue.from({ asset: fee.asset, value: fee.amount }).add(
                acc.inbound.networkFee,
              );
              const inboundFeeUSD = inboundFee.mul(assetPriceUsd);
              acc.inbound = {
                ...acc.inbound,
                networkFee: inboundFee.getValue("number"),
                networkFeeUSD: inboundFeeUSD.getValue("number"),
              };
              acc.total = {
                totalFeeUSD: inboundFeeUSD.add(acc.total.totalFeeUSD).getValue("number"),
              };
              return acc;
            }
            if (fee.type === FeeTypeEnum.AFFILIATE) {
              const affiliateFee = inputAsset.set(fee.amount);
              const affiliateFeeUSD = affiliateFee.mul(assetPriceUsd);
              acc.inbound = {
                ...acc.inbound,
                affiliateFee: affiliateFee.getValue("number"),
                affiliateFeeUSD: affiliateFeeUSD.getValue("number"),
              };
              acc.total = {
                totalFeeUSD: affiliateFeeUSD.add(acc.total.totalFeeUSD).getValue("number"),
              };
              return acc;
            }
            if (fee.type === FeeTypeEnum.OUTBOUND) {
              const outboundFee = AssetValue.from({ asset: fee.asset, value: fee.amount }).add(
                acc.outbound.networkFee,
              );
              const outboundFeeUSD = outboundFee.mul(assetPriceUsd);
              acc.outbound = {
                ...acc.outbound,
                networkFee: outboundFee.getValue("number"),
                networkFeeUSD: outboundFeeUSD.getValue("number"),
              };
              acc.total = {
                totalFeeUSD: outboundFeeUSD.add(acc.total.totalFeeUSD).getValue("number"),
              };
              return acc;
            }
            if (fee.type === FeeTypeEnum.NETWORK) {
              const networkFee = AssetValue.from({ asset: fee.asset, value: fee.amount }).add(
                acc.slippage.slipFee,
              );
              acc.slippage = {
                ...acc.slippage,
                slipFee: networkFee.getValue("number"),
                slipFeeUSD: networkFee.getValue("number"),
              };
              acc.total = {
                totalFeeUSD: networkFee.add(acc.total.totalFeeUSD).getValue("number"),
              };
              return acc;
            }
            if (fee.type === FeeTypeEnum.LIQUIDITY) {
              const networkFee = AssetValue.from({ asset: fee.asset, value: fee.amount }).add(
                acc.slippage.slipFee,
              );
              const networkFeeUSD = networkFee.mul(assetPriceUsd);
              acc.slippage = {
                ...acc.slippage,
                slipFee: networkFee.getValue("number"),
                slipFeeUSD: networkFeeUSD.getValue("number"),
              };
              acc.total = {
                totalFeeUSD: networkFeeUSD.add(acc.total.totalFeeUSD).getValue("number"),
              };
              return acc;
            }
            return acc;
          },
          {
            inbound: {
              networkFee: 0,
              networkFeeUSD: 0,
              affiliateFee: 0,
              affiliateFeeUSD: 0,
            },
            outbound: {
              networkFee: 0,
              networkFeeUSD: 0,
              affiliateFee: 0,
              affiliateFeeUSD: 0,
            },
            slippage: { slipFee: 0, slipFeeUSD: 0 },
            total: { totalFeeUSD: 0 },
          },
        );

        return {
          ...route,
          timeEstimates: route.estimatedTime,
          path: `${route.sellAsset} -> ${route.buyAsset}`,
          expectedOutput: route.expectedBuyAmount,
          isApproved: true,
          fees: {
            [route?.providers[0]]: [
              {
                type: "inbound",
                asset: route.sellAsset,
                networkFee: v2Fees?.inbound.networkFee,
                networkFeeUSD: v2Fees?.inbound.networkFeeUSD,
                affiliateFee: v2Fees?.inbound.affiliateFee,
                affiliateFeeUSD: v2Fees?.inbound.affiliateFeeUSD,
                totalFee: v2Fees?.inbound.networkFee,
                totalFeeUSD: v2Fees?.inbound.networkFeeUSD,
                isOutOfPocket: true,
              },
              {
                type: "outbound",
                asset: route.buyAsset,
                networkFee: v2Fees?.outbound.networkFee,
                networkFeeUSD: v2Fees?.outbound.networkFeeUSD,
                affiliateFee: 0,
                affiliateFeeUSD: 0,
                slipFee: v2Fees?.slippage.slipFee,
                slipFeeUSD: v2Fees?.slippage.slipFeeUSD,
                totalFee: 0,
                totalFeeUSD: v2Fees?.total.totalFeeUSD,
                isOutOfPocket: false,
              },
            ],
          },
        };
      });
    if (!(data?.routes || filteredRoutes) || isInputZero) return setRoutes([]);

    // @ts-expect-error
    const reducedV2Routes = reduceV2StreamingRoutes(filteredRoutes);

    setSortedRoutes(
      // @ts-expect-error
      [...(data ? data.routes : []), ...reducedV2Routes],
    );

    setApprovalsLoading(true);
  }, [
    data,
    inputAsset,
    isFetching,
    isInputZero,
    routes?.length,
    setSortedRoutes,
    inputAmount,
    affiliateBasisPoints,
  ]);
  const selectedRoute: RouteWithApproveType | undefined = useMemo(
    () =>
      quoteError || isLoading || inputAmount.getValue("number") === 0
        ? undefined
        : routes.find((route) => route.providers.join() === selectedProvider.join()) || routes[0],
    [quoteError, inputAmount, isLoading, routes, selectedProvider],
  );

  useEffect(() => {
    // reset routes if any of params changed
    if (inputAsset || inputAmount || outputAsset) {
      setRoutes([]);
    }
  }, [inputAmount, inputAsset, outputAsset]);

  useEffect(() => {
    const errorMessage =
      // @ts-expect-error
      quoteError?.data?.message;

    if (errorMessage && !showingQuoteError.current) {
      showingQuoteError.current = true;
      //   showWarningToast(errorMessage);

      setTimeout(() => {
        showingQuoteError.current = false;
      }, 3000);
    }
    // @ts-expect-error
  }, [quoteError?.data?.message]);

  return {
    refetch: refetchAllQuotes,
    affiliateBasisPoints,
    vTHORDiscount: !IS_LEDGER_LIVE && VTHORBalance.gte(1_000),
    error: quoteError,
    estimatedTime: (selectedRoute || routes[0])?.estimatedTime,
    isFetching:
      (approvalsLoading || ((isLoading || isFetching) && routes.length === 0)) && !quoteError,
    routes,
    selectedRoute: selectedRoute || routes[0],
    setSwapRoute,
    quoteId: data?.quoteId,
  };
};
