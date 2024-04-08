import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useMemo } from 'react';
import type { StreamSwapParams } from 'views/Swap/hooks/useSwapParams';

// max time 24h
const MAX_TIME = 24 * 60 * 60 * 1000;

type Props = {
  timeEstimates: RouteWithApproveType['timeEstimates'] | undefined;
  streamSwap: boolean;
  streamingSwapParams?: null | StreamSwapParams;
  useMaxTime?: boolean;
};

export const useSwapTimeEstimate = ({
  streamingSwapParams,
  timeEstimates,
  streamSwap,
  useMaxTime,
}: Props) => {
  const time = useMemo(() => {
    if (!timeEstimates) return null;

    // propMs - v1 quote (in miliseconds)
    // prop - v2 quote (in seconds)
    const inboundMs = timeEstimates.inbound
      ? timeEstimates.inbound * 1000
      : timeEstimates.inboundMs;
    const swapMs = timeEstimates.swap ? timeEstimates.swap * 1000 : timeEstimates.swapMs;
    const outboundMs = timeEstimates.outbound
      ? timeEstimates.outbound * 1000
      : timeEstimates.outboundMs;
    const streamingFromRoute = timeEstimates.streaming
      ? timeEstimates.streaming * 1000
      : timeEstimates.streamingMs;

    const streaming = streamingSwapParams
      ? streamingSwapParams.interval * streamingSwapParams.subswaps * 6000
      : streamingFromRoute;

    const timeNotStreaming = inboundMs + swapMs + outboundMs;
    const timeStreaming = inboundMs + swapMs + Math.max(streaming, outboundMs);

    return streamSwap ? timeStreaming : timeNotStreaming;
  }, [streamingSwapParams, timeEstimates, streamSwap]);

  return useMaxTime ? MAX_TIME : time;
};
