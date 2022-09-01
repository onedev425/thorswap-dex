import { Box } from 'components/Atomic';
import { useTxDetails } from 'components/TxManager/hooks/useTxDetails';
import { Fragment } from 'react';
import { TxTracker } from 'store/midgard/types';

import { TxInfoRow } from './TxInfoRow';

type Props = {
  txTracker: TxTracker;
};

export const TxContent = ({ txTracker }: Props) => {
  const txDetails = useTxDetails(txTracker);

  if (!txDetails) {
    return null;
  }

  return (
    <Box col className="flex-1 gap-1">
      {txDetails.map((item) => (
        <Fragment key={`${item.status}${item.label}`}>
          <Box className="border-t border-b-0 border-solid flex-1 border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20" />
          <TxInfoRow {...item} />
        </Fragment>
      ))}
    </Box>
  );
};
