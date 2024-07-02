import { Flex, Text } from "@chakra-ui/react";
import { Icon, Tooltip } from "components/Atomic";
import { formatDuration, getTxState } from "components/TransactionTracker/helpers";
import { useMemo } from "react";
import { t } from "services/i18n";
import type { TxTrackerLeg } from "store/transactions/types";

type Props = {
  leg: TxTrackerLeg;
  isTxFinished: boolean;
  timeLeft?: number | null;
};

export const TxLegTimer = ({ leg, isTxFinished, timeLeft }: Props) => {
  const transient = leg?.transient;
  const startTimestamp = leg?.startTimestamp || null;
  const endTimestamp = leg?.endTimestamp || null;
  const estimatedDuration = leg?.estimatedDuration ? leg?.estimatedDuration : null;
  const { finished: isLegFinished, timedOut } = getTxState(leg.status);

  // final duration
  const duration = startTimestamp && endTimestamp ? endTimestamp - startTimestamp : null;
  const timeLabel = useMemo(() => {
    if (timedOut) {
      return "Unknown";
    }

    if (!startTimestamp && estimatedDuration) {
      return formatDuration(estimatedDuration);
    }

    if (typeof timeLeft !== "number") {
      return t("txManager.txEstimating");
    }

    if (timeLeft < 1000) {
      return t("txManager.txFinishing");
    }

    return formatDuration(timeLeft);
  }, [estimatedDuration, startTimestamp, timeLeft, timedOut]);

  if ((isTxFinished || isLegFinished) && !timedOut) {
    return (
      <Tooltip content={t("txManager.txDuration")}>
        <Flex alignItems="center" gap={1}>
          {duration !== null ? (
            <>
              <Icon name="timer" size={14} />
              <Text fontWeight="light" textStyle="caption-xs">
                {formatDuration(transient ? transient.estimatedTimeToComplete * 1000 : duration)}
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
    <Tooltip content={t("txManager.txEstimatedTimeLeft")}>
      <Flex alignItems="center" gap={1}>
        <Icon name="timerCountdown" size={14} />
        <Text fontWeight="light" textStyle="caption-xs">
          {timeLabel}
        </Text>
      </Flex>
    </Tooltip>
  );
};
