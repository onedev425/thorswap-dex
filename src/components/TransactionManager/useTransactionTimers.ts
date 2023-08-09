import { getTxState } from 'components/TransactionTracker/helpers';
import { useEffect, useMemo, useState } from 'react';
import { TxTrackerLeg } from 'store/transactions/types';

type LegTimer = { timeLeft: number | null; isCompleted: boolean };
type Params = { isTxFinished: boolean; estimatedDuration?: number | null };

export const useTransactionTimers = (
  legs: TxTrackerLeg[],
  { isTxFinished, estimatedDuration }: Params,
) => {
  const [refreshCounter, setRefreshCounter] = useState(1);

  const legsTimers = useMemo(() => {
    if (!legs.length || !refreshCounter) return [];

    const now = Date.now();
    const legsState: LegTimer[] = legs.map((leg) => {
      const { completed } = getTxState(leg.status);

      if (leg.endTimestamp || completed) {
        return { timeLeft: 0, isCompleted: true };
      }

      if (leg.estimatedDuration && !leg.startTimestamp) {
        return { timeLeft: leg.estimatedDuration, isCompleted: completed };
      }

      if (leg.startTimestamp && leg.estimatedDuration) {
        const timeLeft = leg.startTimestamp + leg.estimatedDuration - now;
        return { timeLeft: timeLeft < 1000 ? 0 : timeLeft, isCompleted: completed };
      }

      return { timeLeft: null, isCompleted: completed };
    });

    return legsState;
  }, [legs, refreshCounter]);

  const canUseLegsDuration = useMemo(() => {
    return legs.length && legs.every((leg) => typeof leg.estimatedDuration !== 'undefined');
  }, [legs]);

  const totalTimeLeft = useMemo(() => {
    if (!canUseLegsDuration) {
      return typeof estimatedDuration === 'undefined' ? null : estimatedDuration;
    }

    if (isTxFinished) {
      return 0;
    }

    return legsTimers.reduce<number | null>((acc, legState) => {
      if (legState.isCompleted && legState.timeLeft === 0) {
        return acc;
      }

      if (!legState.timeLeft || acc === null) {
        return null;
      }

      return acc + legState.timeLeft;
    }, 0);
  }, [canUseLegsDuration, estimatedDuration, isTxFinished, legsTimers]);

  useEffect(() => {
    if (
      !refreshCounter ||
      totalTimeLeft === null ||
      totalTimeLeft < 1000 ||
      isTxFinished ||
      legsTimers.every((leg) => Number(leg.timeLeft) < 1000)
    ) {
      return;
    }

    // recalculating state every second
    const timeoutId = setTimeout(() => {
      setRefreshCounter((v) => v + 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isTxFinished, legsTimers, refreshCounter, totalTimeLeft]);

  useEffect(() => {
    if (!refreshCounter) {
      setRefreshCounter(1);
    }
  }, [refreshCounter]);

  return { legsTimers, totalTimeLeft };
};
