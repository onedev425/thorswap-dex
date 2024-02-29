import { Skeleton, Text } from '@chakra-ui/react';
import { Box, Icon, Link } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { getEstimatedTxDuration, transactionTitle } from 'components/TransactionManager/helpers';
import { TxDetailsButton } from 'components/TransactionManager/TxDetailsButton';
import { useAdvancedTracker } from 'components/TransactionManager/useAdvancedTracker';
import { useSimpleTracker } from 'components/TransactionManager/useSimpleTracker';
import { useTransactionTimers } from 'components/TransactionManager/useTransactionTimers';
import { useTrackerV2 } from 'components/TransactionTrackerV2/useTrackerV2';
import { CircularCountdown } from 'components/TxTracker/components/CircularCountdown';
import { memo } from 'react';
import type { PendingTransactionType } from 'store/transactions/types';

const trackerV2Providers = ['CHAINFLIP'];

export const PendingTransaction = memo((pendingTx: PendingTransactionType) => {
  const { quoteId, route, txid, details: txDetails, advancedTracker } = pendingTx;
  // keep it backward compatible with old cached txs
  const hasDetailsParams = (txid && route && quoteId) || txDetails;
  const provider = route?.providers[0] || '';
  const isV2Tracker = trackerV2Providers.includes(provider);

  const simpleTrackerData = useSimpleTracker(
    hasDetailsParams || advancedTracker ? null : pendingTx,
  );
  const advancedTrackerData = useAdvancedTracker(
    (!hasDetailsParams && !advancedTracker) || isV2Tracker ? null : pendingTx,
  );
  const trackerV2Data = useTrackerV2(!isV2Tracker ? null : pendingTx);

  const { totalTimeLeft } = useTransactionTimers(txDetails?.legs || [], { isTxFinished: false });
  const txData = simpleTrackerData || advancedTrackerData || pendingTx || trackerV2Data;

  const { label, type, details } = txData;
  const transactionUrl = 'txUrl' in txData ? txData.txUrl : '';

  return (
    <Box alignCenter flex={1} justify="between">
      <Box alignCenter className="w-full gap-2">
        <CircularCountdown
          estimatedDuration={getEstimatedTxDuration(txDetails)}
          hasDetails={!!txDetails}
          timeLeft={totalTimeLeft}
        />

        <Box col className="gap-1 w-full">
          {type ? (
            <Text fontWeight="semibold">{transactionTitle(type)}</Text>
          ) : (
            <Skeleton height="15px" width="50%" />
          )}

          {label ? (
            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
              {label}
            </Text>
          ) : (
            <Skeleton height="20px" />
          )}
        </Box>
      </Box>

      <Box className="w-[80px]" justify="end">
        {transactionUrl && (
          <Link external className="inline-flex" to={transactionUrl}>
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}

        {details && <TxDetailsButton txid={details.firstTransactionHash} />}
      </Box>
    </Box>
  );
});
