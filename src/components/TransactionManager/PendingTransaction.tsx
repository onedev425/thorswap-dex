import { Skeleton, Text } from '@chakra-ui/react';
import { Box, Icon, Link } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { transactionTitle } from 'components/TransactionManager/helpers';
import { TxDetailsButton } from 'components/TransactionManager/TxDetailsButton';
import { useAdvancedTracker } from 'components/TransactionManager/useAdvancedTracker';
import { useSimpleTracker } from 'components/TransactionManager/useSimpleTracker';
import { CircularCountdown } from 'components/TxTracker/components/CircularCountdown';
import { memo } from 'react';
import { PendingTransactionType } from 'store/transactions/types';

export const PendingTransaction = memo((pendingTx: PendingTransactionType) => {
  const { quoteId, route, txid, details: txDetails } = pendingTx;
  const hasDetailsParams = (txid && route && quoteId) || txDetails;

  const simpleTrackerData = useSimpleTracker(hasDetailsParams ? null : pendingTx);
  const advancedTrackerData = useAdvancedTracker(!hasDetailsParams ? null : pendingTx);
  const txData = simpleTrackerData || advancedTrackerData || pendingTx;

  const { label, type, details } = txData;
  const transactionUrl = 'txUrl' in txData ? txData.txUrl : '';

  return (
    <Box alignCenter flex={1} justify="between">
      <Box alignCenter className="w-full gap-2">
        <CircularCountdown
          estimatedDuration={txDetails?.estimatedDuration}
          startTimestamp={txDetails?.startTimestamp}
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
