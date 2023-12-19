import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useMemo } from 'react';
import type { StreamSwapParams } from 'views/Swap/hooks/useSwapParams';

// max time 24h
const MAX_TIME = 24 * 60 * 60 * 1000;

type Props = {
  streamingSwapParams: null | StreamSwapParams;
  route: RouteWithApproveType | undefined;
  streamSwap: boolean;
  useMaxTime: boolean;
};

export const useSwapTimeEstimate = ({
  streamingSwapParams,
  route,
  streamSwap,
  useMaxTime,
}: Props) => {
  const time = useMemo(() => {
    if (!route) return null;

    const { timeEstimates } = route;
    if (!timeEstimates) return null;

    const { inboundMs, swapMs, outboundMs, streamingMs: stremingFromRoute } = timeEstimates;

    const streaming = streamingSwapParams
      ? streamingSwapParams.interval * streamingSwapParams.subswaps * 6000
      : stremingFromRoute;

    const timeNotStreaming = inboundMs + swapMs + outboundMs;
    const timeStreaming = swapMs + inboundMs + Math.max(streaming, outboundMs);

    return streamSwap ? timeStreaming : timeNotStreaming;
  }, [streamingSwapParams, route, streamSwap]);

  return useMaxTime ? MAX_TIME : time;
};
