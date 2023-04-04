import { Flex, Text } from '@chakra-ui/react';
import { Icon, Tooltip } from 'components/Atomic';
import { formatDuration, getTxState } from 'components/TransactionTracker/helpers';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { TxTrackerLeg } from 'store/transactions/types';

type Props = {
  leg: TxTrackerLeg;
  isTxFinished: boolean;
  timeLeft?: number | null;
};

export const TxLegTimer = ({ leg, isTxFinished, timeLeft }: Props) => {
  const startTimestamp = leg?.startTimestamp || null;
  const endTimestamp = leg?.endTimestamp || null;
  const estimatedDuration = leg?.estimatedDuration ? leg?.estimatedDuration : null;
  const { finished: isLegFinished } = getTxState(leg.status);
  // final duration
  const duration = startTimestamp && endTimestamp ? endTimestamp - startTimestamp : null;

  const timeLabel = useMemo(() => {
    if (!startTimestamp && estimatedDuration) {
      return formatDuration(estimatedDuration);
    }

    if (typeof timeLeft !== 'number') {
      return 'Estimating...';
    }

    if (timeLeft < 1000) {
      return 'Finishing...';
    }

    return formatDuration(timeLeft);
  }, [estimatedDuration, startTimestamp, timeLeft]);

  if (isTxFinished || isLegFinished) {
    return (
      <Tooltip content={t('txManager.txDuration')}>
        <Flex alignItems="center" gap={1}>
          {duration !== null ? (
            <>
              <Icon name="timer" size={14} />
              <Text fontWeight="light" textStyle="caption-xs">
                {formatDuration(duration)}
              </Text>
            </>
          ) : (
            <div />
          )}
        </Flex>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={t('txManager.txEstimatedTimeLeft')}>
      <Flex alignItems="center" gap={1}>
        <Icon name="timerCountdown" size={14} />
        <Text fontWeight="light" textStyle="caption-xs">
          {timeLabel}
        </Text>
      </Flex>
    </Tooltip>
  );
};
