import { Flex, useMediaQuery } from '@chakra-ui/react';
import { useTransactionTimers } from 'components/TransactionManager/useTransactionTimers';
import { TxDetailsInfo } from 'components/TransactionTracker/components/TxDetailsInfo';
import { TxLegPreview } from 'components/TransactionTracker/components/TxLegPreview';
import { TxTrackerDetails } from 'store/transactions/types';

type Props = {
  txDetails: TxTrackerDetails;
  isCompleted: boolean;
};

export const TxPreview = ({ txDetails, isCompleted }: Props) => {
  const legsLength = txDetails?.legs?.length;
  const hasLegs = legsLength > 0;
  const [isLargerThan840] = useMediaQuery('(min-width: 840px)');
  const [isLargerThan505] = useMediaQuery('(min-width: 505px)');
  const { totalTimeLeft, legsTimers } = useTransactionTimers(txDetails.legs || [], {
    estimatedDuration: txDetails.estimatedDuration,
    isTxFinished: false,
  });

  const horizontalView =
    legsLength === 1 ||
    (legsLength === 2 && isLargerThan505) ||
    (legsLength === 3 && isLargerThan840);

  if (!txDetails) return null;

  return (
    <Flex direction="column" flex={1} justifyContent="flex-start" px={3}>
      <Flex direction={horizontalView ? 'row' : 'column'} gap={0.5} justify="center">
        {hasLegs &&
          txDetails.legs.map((leg, index) => (
            <TxLegPreview
              currentLegIndex={Number(txDetails.currentLegIndex)}
              horizontalView={horizontalView}
              index={index}
              isLast={(txDetails.legs.length || 1) - 1 === index}
              key={`${leg.hash}${leg.txnType}`}
              leg={leg}
              legTimeLeft={legsTimers[index]?.timeLeft}
              txDetails={txDetails}
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
