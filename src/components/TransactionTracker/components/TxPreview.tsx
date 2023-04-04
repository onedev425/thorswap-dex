import { Flex } from '@chakra-ui/react';
import { useTransactionTimers } from 'components/TransactionManager/useTransactionTimers';
import { TxDetailsInfo } from 'components/TransactionTracker/components/TxDetailsInfo';
import { TxLegPreview } from 'components/TransactionTracker/components/TxLegPreview';
import { TxTrackerDetails } from 'store/transactions/types';

type Props = {
  txDetails: TxTrackerDetails;
  isCompleted: boolean;
};

export const TxPreview = ({ txDetails, isCompleted }: Props) => {
  const hasLegs = txDetails?.legs?.length > 0;
  const { totalTimeLeft, legsTimers } = useTransactionTimers(txDetails.legs || [], {
    estimatedDuration: txDetails.estimatedDuration,
    isTxFinished: false,
  });

  if (!txDetails) {
    return null;
  }

  return (
    <Flex direction="column" flex={1} justifyContent="flex-start" px={3}>
      <Flex alignContent="flex-start" alignSelf="center" flexWrap="wrap" gap={2}>
        {hasLegs &&
          txDetails.legs.map((leg, index) => (
            <TxLegPreview
              currentLegIndex={Number(txDetails.currentLegIndex)}
              index={index}
              isLast={(txDetails.legs.length || 1) - 1 === index}
              key={`${leg.hash}${leg.txnType}`}
              leg={leg}
              legTimeLeft={legsTimers[index]?.timeLeft}
              txStatus={txDetails.status}
            />
          ))}
      </Flex>

      <TxDetailsInfo
        isCompleted={isCompleted}
        totalTimeLeft={totalTimeLeft}
        txDetails={txDetails}
      />
    </Flex>
  );
};
