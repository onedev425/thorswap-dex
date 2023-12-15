import { useCallback, useMemo } from 'react';
import { useGetQueueQuery } from 'store/midgard/api';

const QUEUE_BUSY_LEVEL = 30;
const QUEUE_SLOW_LEVEL = 10;

export enum StatusType {
  Good = 'Good',
  Slow = 'Slow',
  Busy = 'Busy',
  Offline = 'Offline',
}

export const useNetwork = () => {
  const { data: queueData } = useGetQueueQuery(undefined, { pollingInterval: 60000 });

  const outboundQueue = useMemo(() => Number(queueData?.outbound ?? 0), [queueData?.outbound]);
  const getQueueLevel = useCallback((queueValue: number) => {
    if (queueValue > QUEUE_BUSY_LEVEL) return StatusType.Busy;
    if (queueValue > QUEUE_SLOW_LEVEL) return StatusType.Slow;
    return StatusType.Good;
  }, []);

  return { outboundQueue, outboundQueueLevel: getQueueLevel(outboundQueue) };
};
