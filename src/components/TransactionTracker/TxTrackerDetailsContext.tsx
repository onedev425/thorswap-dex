import { TransactionType, TxTrackerDetails } from '@thorswap-lib/swapkit-api';
import { TrackerTxDisplayType } from 'components/TransactionTracker/types';
import { createContext, ReactNode, useContext, useMemo } from 'react';

type TxTrackerDetailsState = {
  txDetails: TxTrackerDetails | undefined | null;
  txDisplayType: TrackerTxDisplayType | undefined;
};

const TxTrackerContext = createContext<TxTrackerDetailsState>({
  txDetails: undefined,
  txDisplayType: undefined,
});

type Props = {
  children: ReactNode;
  txDetails: TxTrackerDetails | undefined | null;
};

export const useTxTrackerDetails = () => useContext(TxTrackerContext);

export const TxTrackerDetailsProvider = ({ children, txDetails }: Props) => {
  const txDisplayType = useMemo(() => {
    if (!txDetails) return;

    if (txDetails.legs?.find((leg) => leg.txnType === TransactionType.TC_LENDING)) {
      // TODO: separate borrow and repay
      return TrackerTxDisplayType.LENDING;
    }

    return TrackerTxDisplayType.SWAP;
  }, [txDetails]);

  const value = useMemo(
    () => ({
      txDetails,
      txDisplayType,
    }),
    [txDetails, txDisplayType],
  );

  return <TxTrackerContext.Provider value={value}>{children}</TxTrackerContext.Provider>;
};
