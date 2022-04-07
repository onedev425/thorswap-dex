import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'store/midgard/hooks'

import { useMimir } from './useMimir'

export enum QueueLevel {
  GOOD = 'GOOD', // queue < 10
  SLOW = 'SLOW', // 10 < queue < 30
  BUSY = 'BUSY', // 30 < queue
}

const QUEUE_BUSY_LEVEL = 30
const QUEUE_SLOW_LEVEL = 10

export enum StatusType {
  Normal = 'Normal',
  Warning = 'Warning',
  Error = 'Error',
}

export const useNetwork = () => {
  const { networkData, queue } = useMidgard()
  const { isFundsCapReached, maxLiquidityRune } = useMimir()

  const outboundQueue = Number(queue?.outbound ?? 0)

  const getQueueLevel = (queueValue: number) => {
    if (queueValue > QUEUE_BUSY_LEVEL) return QueueLevel.BUSY
    if (queueValue > QUEUE_SLOW_LEVEL) return QueueLevel.SLOW
    return QueueLevel.GOOD
  }

  const outboundQueueLevel: QueueLevel = getQueueLevel(outboundQueue)
  const isOutboundBusy = outboundQueueLevel === QueueLevel.BUSY
  const isOutboundDelayed =
    outboundQueueLevel === QueueLevel.BUSY ||
    outboundQueueLevel === QueueLevel.SLOW

  const getOutboundBusyTooltip = () => {
    return 'The network is currently experiencing delays signing outgoing transactions.'
  }

  const statusOptions: {
    [key: string]: StatusType
  } = useMemo(
    () => ({
      GOOD: StatusType.Normal,
      SLOW: StatusType.Warning,
      BUSY: StatusType.Error,
    }),
    [],
  )

  const statusType: StatusType = useMemo(() => {
    if (isFundsCapReached) return StatusType.Warning

    return statusOptions[outboundQueueLevel]
  }, [statusOptions, isFundsCapReached, outboundQueueLevel])

  const totalPooledRune: Amount = Amount.fromMidgard(
    networkData?.totalPooledRune ?? 0,
  )

  const globalRunePooledStatus = maxLiquidityRune.gt(0)
    ? `${totalPooledRune.toAbbreviate(2)} / ${maxLiquidityRune.toAbbreviate(
        2,
      )} RUNE POOLED`
    : `${totalPooledRune.toAbbreviate(2)} RUNE POOLED`

  return {
    globalRunePooledStatus,
    isValidFundCaps: !isFundsCapReached,
    QueueLevel,
    outboundQueue,
    outboundQueueLevel,
    isOutboundDelayed,
    isOutboundBusy,
    statusType,
    totalPooledRune,
    maxLiquidityRune,
    getOutboundBusyTooltip,
  }
}
