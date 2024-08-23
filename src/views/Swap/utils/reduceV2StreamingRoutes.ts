import type {
  GetTokensQuoteResponse,
  StreamingSwapRouteParams,
  SwapWarning,
} from "store/thorswap/types";

type V2RoutePart = {
  memo: string;
  warnings: SwapWarning[];
};

// v2 routes mapped to v1 params, includes v2 payload extended with v1 needed params
type V2MappedRoute = GetTokensQuoteResponse["routes"][0] & V2RoutePart;

export const reduceV2StreamingRoutes = (routes: V2MappedRoute[]) => {
  return routes.reduce((acc, route) => {
    // skip streaming routes
    if (route.providers[0].includes("_STREAMING")) return acc;

    // find route pairs by comparing providers - PROVIDER -> PROVIDER_STREAMING
    const streamingSwapRoute = routes.find(
      (r) => r.providers[0] === `${route.providers[0]}_STREAMING`,
    );

    acc.push(mapV2RoutesToStreamingSwap({ route, streamingSwapRoute }));

    return acc;
  }, [] as V2MappedRoute[]);
};

const mapV2RoutesToStreamingSwap = ({
  route,
  streamingSwapRoute,
}: {
  route: V2MappedRoute;
  streamingSwapRoute?: V2MappedRoute;
}) => {
  const mappedRoute = { ...route };

  if (!streamingSwapRoute) return mappedRoute;

  const { maxQuantity, maxIntervalForMaxQuantity } = getStreamingParamsFromMemo(
    streamingSwapRoute.memo,
  );
  const { savingsInAsset, savingsInUSD } = getSavings({ route, streamingSwapRoute });

  const streamingSwap: StreamingSwapRouteParams = {
    expectedOutput: streamingSwapRoute.expectedOutput,
    expectedOutputMaxSlippage: streamingSwapRoute.expectedOutputMaxSlippage,
    expectedOutputUSD: streamingSwapRoute.expectedOutputUSD,
    expectedOutputMaxSlippageUSD: streamingSwapRoute.expectedOutputMaxSlippageUSD,
    estimatedTime: streamingSwapRoute.estimatedTime,
    fees: streamingSwapRoute.fees,
    memo: streamingSwapRoute.memo,
    maxQuantity,
    maxIntervalForMaxQuantity,
    savingsInAsset,
    savingsInUSD,
    warnings: streamingSwapRoute.warnings,
  };

  return {
    ...mappedRoute,
    streamingSwap,
  };
};

function getStreamingParamsFromMemo(memo: string) {
  const memoParts = memo?.split(":");
  const memoStreamingIndex = 3;

  if (!memoParts || memoParts?.length < memoStreamingIndex + 1) {
    return { maxQuantity: 0, maxIntervalForMaxQuantity: 0 };
  }

  const streaminMemoPart = memoParts[memoStreamingIndex];
  const [, , maxQuantity] = streaminMemoPart.split("/");

  const day = 24 * 60 * 60; // 24 hours
  const blockTime = 6; // 6 seconds
  const maxIntervalForMaxQuantity = Math.round(day / (Number(maxQuantity) * blockTime));

  return {
    maxQuantity: Number(maxQuantity) || 0,
    maxIntervalForMaxQuantity: Number(maxIntervalForMaxQuantity) || 0,
  };
}

function getSavings({
  route,
  streamingSwapRoute,
}: {
  // v2 routes mapped to v1 params
  route: GetTokensQuoteResponse["routes"][0] & V2RoutePart;
  streamingSwapRoute: GetTokensQuoteResponse["routes"][0] & V2RoutePart;
}) {
  const savingsInAsset = `${Number(streamingSwapRoute.expectedOutput) - Number(route.expectedOutput)}`;

  // usd value not available in v2
  return { savingsInAsset, savingsInUSD: "0" };
}
