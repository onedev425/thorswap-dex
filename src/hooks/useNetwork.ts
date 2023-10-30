import { Amount } from '@thorswap-lib/swapkit-core';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useCallback } from 'react';
import { useGetNetworkQuery, useGetQueueQuery } from 'store/midgard/api';

const QUEUE_BUSY_LEVEL = 30;
const QUEUE_SLOW_LEVEL = 10;

export enum StatusType {
  Good = 'Good',
  Slow = 'Slow',
  Busy = 'Busy',
  Offline = 'Offline',
}

export const useNetwork = () => {
  const { data: networkData } = useGetNetworkQuery(undefined, { pollingInterval: 60000 });
  const { data: queueData } = useGetQueueQuery(undefined, { pollingInterval: 60000 });
  const hardCapReached = useCheckHardCap();

  const outboundQueue = Number(queueData?.outbound ?? 0);

  const getQueueLevel = useCallback((queueValue: number) => {
    if (queueValue > QUEUE_BUSY_LEVEL) return StatusType.Busy;
    if (queueValue > QUEUE_SLOW_LEVEL) return StatusType.Slow;
    return StatusType.Good;
  }, []);

  const outboundQueueLevel = getQueueLevel(outboundQueue);

  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune ?? 0);

  return {
    outboundQueue,
    outboundQueueLevel,
    statusType: hardCapReached ? StatusType.Slow : outboundQueueLevel,
    totalPooledRune,
  };
};
