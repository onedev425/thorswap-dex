import { Amount } from '@thorswap-lib/swapkit-core';
import { t } from 'services/i18n';
import { useMidgard } from 'store/midgard/hooks';

import { useMimir } from './useMimir';

const QUEUE_BUSY_LEVEL = 30;
const QUEUE_SLOW_LEVEL = 10;

export enum StatusType {
  Good = 'Good',
  Slow = 'Slow',
  Busy = 'Busy',
}

export const useNetwork = () => {
  const { networkData, queue } = useMidgard();
  const { isFundsCapReached, maxLiquidityRune } = useMimir();

  const outboundQueue = Number(queue?.outbound ?? 0);

  const getQueueLevel = (queueValue: number) => {
    if (queueValue > QUEUE_BUSY_LEVEL) return StatusType.Busy;
    if (queueValue > QUEUE_SLOW_LEVEL) return StatusType.Slow;
    return StatusType.Good;
  };

  const outboundQueueLevel = getQueueLevel(outboundQueue);

  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune ?? 0);

  const globalRunePooledStatus = maxLiquidityRune.gt(0)
    ? `${totalPooledRune.toAbbreviate(2)} / ${maxLiquidityRune.toAbbreviate(2)} ${t(
        'notification.runePooled',
      )}`
    : `${totalPooledRune.toAbbreviate(2)} ${t('notification.runePooled')}`;

  return {
    globalRunePooledStatus,
    isValidFundCaps: !isFundsCapReached,
    maxLiquidityRune,
    outboundQueue,
    outboundQueueLevel,
    statusType: isFundsCapReached ? StatusType.Slow : outboundQueueLevel,
    totalPooledRune,
  };
};
