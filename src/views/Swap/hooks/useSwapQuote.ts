import type { QuoteResponse, QuoteResponseRoute, SwapKitNumber } from "@swapkit/sdk";
import { AssetValue, FeeTypeEnum, ProviderName } from "@swapkit/sdk";
import type { RouteWithApproveType } from "components/SwapRouter/types";
import { THORSWAP_AFFILIATE_ADDRESS, THORSWAP_AFFILIATE_ADDRESS_LL } from "config/constants";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useVTHORBalance } from "hooks/useHasVTHOR";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IS_BETA, IS_DEV_API, IS_LEDGER_LIVE, IS_LOCAL } from "settings/config";
import { useApp } from "store/app/hooks";
import { useAppSelector } from "store/store";
import { useGetTokensQuoteQuery, useGetV2QuoteQuery } from "store/thorswap/api";
import type { GetTokensQuoteResponse } from "store/thorswap/types";
import { checkAssetApprove } from "views/Swap/hooks/useIsAssetApproved";
import { Provider } from "views/Swap/hooks/useTokenList";

type Params = {
  inputAsset: AssetValue;
  inputAmount: SwapKitNumber;
  ethAddress?: string;
  outputAsset: AssetValue;
  recipientAddress?: string;
  senderAddress?: string;
  skipAffiliate?: boolean;
  inputUSDPrice: number;
  inputUnitPrice: number;
  outputUnitPrice: number;
  providers: Provider[];
};

export const useSwapQuote = ({
  ethAddress,
  inputAsset,
  inputAmount,
  outputAsset,
  recipientAddress,
  senderAddress,
  inputUSDPrice,
  inputUnitPrice,
  outputUnitPrice,
  providers,
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

    let basisPoints = 30;

    if (VTHORBalance.gte(1_000)) basisPoints = 25;
    if (VTHORBalance.gte(10_000)) basisPoints = 15;
    if (VTHORBalance.gte(100_000)) basisPoints = 10;
    if (VTHORBalance.gte(500_000)) basisPoints = 0;

    if (IS_LEDGER_LIVE) basisPoints = 50;
    if (IS_BETA || IS_LOCAL) basisPoints = 0;

    if (inputUSDPrice >= 1_000_000) basisPoints /= 2;

    return `${Math.floor(basisPoints)}`;
  }, [VTHORBalance, iframeData?.fee, inputUSDPrice]);

  const params = useMemo(
    () => ({
      affiliateBasisPoints,
      affiliateAddress:
        iframeData?.address ||
        (IS_LEDGER_LIVE ? THORSWAP_AFFILIATE_ADDRESS_LL : THORSWAP_AFFILIATE_ADDRESS),
      sellAsset: inputAsset.isSynthetic ? inputAsset.symbol : inputAsset.toString(),
      buyAsset: outputAsset.isSynthetic ? outputAsset.symbol : outputAsset.toString(),
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
  } = useGetTokensQuoteQuery(params, {
    skip:
      IS_DEV_API ||
      params.sellAmount === "0" ||
      inputAmount.lte(0) ||
      !providers.includes(Provider.V1_PROVIDERS),
  });

  const {
    refetch: refetchChainflip,
    error: errorChainflip,
    isLoading: isLoadingChainflip,
    currentData: chainflipData,
    isFetching: isFetchingChainflip,
    isUninitialized: isChainflipUninitialized,
  } = useGetV2QuoteQuery(
    {
      ...params,
      providers: IS_DEV_API
        ? undefined
        : [ProviderName.CHAINFLIP, ProviderName.MAYACHAIN, ProviderName.MAYACHAIN_STREAMING],
    },
    {
      skip: params.sellAmount === "0" || inputAmount.lte(0),
    },
  );

  //   const {
  //     refetch: refetchMayaSpecial,
  //     error: errorMayaSpecial,
  //     isLoading: isLoadingMayaSpecial,
  //     currentData: mayaSpecialData,
  //     isFetching: isFetchingMayaSpecial,
  //     isUninitialized: isMayaSpecialUninitialized,
  //   } = useGetV2QuoteQuery(
  //     {
  //       ...params,
  //       affiliateBasisPoints: "0",
  //       providers: [ProviderName.MAYACHAIN, "MAYACHAIN_STREAMING"],
  //     },
  //     {
  //       skip:
  //         // TODO move ledger live integration to SK
  //         IS_DEV_API ||
  //         IS_LEDGER_LIVE ||
  //         params.sellAmount === "0" ||
  //         inputAmount.lte(0) ||
  //         !!providers,
  //     },
  //   );

  const quoteError = useMemo(
    () => (error && errorChainflip ? error : undefined),
    [error, errorChainflip],
  );

  const refetchAllQuotes = useMemo(
    () => () => {
      setRoutes([]);
      if (!isUninitialized) {
        refetch();
      }
      if (!isChainflipUninitialized) {
        refetchChainflip();
      }
    },
    [isChainflipUninitialized, isUninitialized, refetch, refetchChainflip],
  );

  const setSortedRoutes = useCallback(
    async (routes: GetTokensQuoteResponse["routes"]) => {
      try {
        const routesWithApprovePromise = routes.map(async (route) => {
          const isApproved =
            senderAddress && !route.providers.includes("CHAINFLIP")
              ? await checkAssetApprove({
                  assetValue: inputAsset.set(inputAmount),
                  contract:
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
    if (isFetching && isFetchingChainflip && !!routes.length) {
      return;
    }

    const chainFlipRoutes = (chainflipData?.routes || []).map((fullRoute: QuoteResponseRoute) => {
      const route = fullRoute?.legs[fullRoute?.legs.length - 1];
      const meta = fullRoute.meta;

      const chainFlipFees = route?.fees?.reduce(
        (acc, fee) => {
          const assetPriceUsd =
            meta.assets?.find((assetMetaData) => assetMetaData.asset === fee.asset)?.price || 0;

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
            // TODO change as soon as API will return affiliate fee in USD
            const affiliateFee = inputAsset.set(inputAmount).mul(affiliateBasisPoints).div(10_000);
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
        ...fullRoute,
        ...route,
        timeEstimates: fullRoute.estimatedTime,
        path: `${route.sellAsset} -> ${route.buyAsset}`,
        providers: fullRoute.providers.toReversed(),
        expectedOutput: fullRoute.expectedBuyAmount,
        isApproved: true,
        fees: {
          [fullRoute?.providers?.includes(ProviderName.CHAINFLIP) ? "FLIP" : "MAYA"]: [
            {
              type: "inbound",
              asset: route.sellAsset,
              networkFee: chainFlipFees?.inbound.networkFee,
              networkFeeUSD: chainFlipFees?.inbound.networkFeeUSD,
              affiliateFee: chainFlipFees?.inbound.affiliateFee,
              affiliateFeeUSD: chainFlipFees?.inbound.affiliateFeeUSD,
              totalFee: chainFlipFees?.inbound.networkFee,
              totalFeeUSD: chainFlipFees?.inbound.networkFeeUSD,
              isOutOfPocket: true,
            },
            {
              type: "outbound",
              asset: route.buyAsset,
              networkFee: chainFlipFees?.outbound.networkFee,
              networkFeeUSD: chainFlipFees?.outbound.networkFeeUSD,
              affiliateFee: 0,
              affiliateFeeUSD: 0,
              slipFee: chainFlipFees?.slippage.slipFee,
              slipFeeUSD: chainFlipFees?.slippage.slipFeeUSD,
              totalFee: 0,
              totalFeeUSD: chainFlipFees?.total.totalFeeUSD,
              isOutOfPocket: false,
            },
          ],
        },
      };
    });
    if (!(data?.routes || chainFlipRoutes) || isInputZero) return setRoutes([]);

    setSortedRoutes(
      // @ts-expect-error
      [...(data ? data.routes : []), ...(chainFlipRoutes ? chainFlipRoutes : [])],
    );

    setApprovalsLoading(true);
  }, [
    chainflipData,
    data,
    inputAsset,
    inputUnitPrice,
    isFetching,
    isFetchingChainflip,
    isInputZero,
    // isLoading,
    // isLoadingChainflip,
    // outputAsset?.decimal,
    outputUnitPrice,
    routes?.length,
    setSortedRoutes,
    inputAmount,
    affiliateBasisPoints,
  ]);
  const selectedRoute: RouteWithApproveType | undefined = useMemo(
    () =>
      quoteError || isLoading || isLoadingChainflip || inputAmount.getValue("number") === 0
        ? undefined
        : routes.find((route) => route.providers.join() === selectedProvider.join()) || routes[0],
    [quoteError, inputAmount, isLoading, isLoadingChainflip, routes, selectedProvider],
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
      quoteError?.data?.message || errorChainflip?.data?.message;

    if (errorMessage && !showingQuoteError.current) {
      showingQuoteError.current = true;
      //   showWarningToast(errorMessage);

      setTimeout(() => {
        showingQuoteError.current = false;
      }, 3000);
    }
    // @ts-expect-error
  }, [errorChainflip?.data?.message, quoteError?.data?.message]);

  return {
    refetch: refetchAllQuotes,
    affiliateBasisPoints,
    vTHORDiscount: !IS_LEDGER_LIVE && VTHORBalance.gte(1_000),
    error: quoteError,
    estimatedTime: (selectedRoute || routes[0])?.estimatedTime,
    isFetching:
      (approvalsLoading ||
        ((isLoading || isFetching || isFetchingChainflip) && routes.length === 0)) &&
      !quoteError,
    routes,
    selectedRoute: selectedRoute || routes[0],
    setSwapRoute,
    quoteId: data?.quoteId,
  };
};
