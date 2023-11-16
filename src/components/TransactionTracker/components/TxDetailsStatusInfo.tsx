import { Text } from '@chakra-ui/react';
import type { TxTrackerDetails } from '@swapkit/api';
import { TxStatus } from '@swapkit/api';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { getEstimatedTxDuration } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import {
  getTxDisplayStatus,
  getTxState,
  getTxStatusColor,
  getTxStatusLabel,
} from 'components/TransactionTracker/helpers';
import { CircularCountdown } from 'components/TxTracker/components/CircularCountdown';
import { t } from 'services/i18n';

type Props = {
  txDetails: TxTrackerDetails;
  totalTimeLeft: number | null;
};

export const TxDetailsStatusInfo = ({ txDetails, totalTimeLeft }: Props) => {
  const { status } = txDetails;
  const { finished, timedOut } = getTxState(status);
  const txStatus = getTxDisplayStatus(status);
  const isStreaming = status === TxStatus.STREAMING;

  if (timedOut) {
    return (
      <InfoWithTooltip
        tooltip={t('txManager.txTimeoutTooltip')}
        value={
          <Text color="brand.yellow" textStyle="caption-xs" textTransform="uppercase">
            {t('txManager.txTimeout')}
          </Text>
        }
      />
    );
  }

  return (
    <>
      <Text color={getTxStatusColor(txStatus)} textStyle="caption-xs" textTransform="uppercase">
        {isStreaming ? t('txManager.streaming') : getTxStatusLabel(txStatus)}
      </Text>
      {finished ? (
        <TransactionStatusIcon size={18} status={txStatus} />
      ) : (
        <CircularCountdown
          estimatedDuration={getEstimatedTxDuration(txDetails)}
          hasDetails={!!txDetails}
          timeLeft={totalTimeLeft}
        />
      )}
    </>
  );
};
