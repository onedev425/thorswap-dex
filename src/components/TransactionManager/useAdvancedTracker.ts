import { getSimpleTxStatus } from 'components/TransactionManager/helpers';
import { useCompleteTransaction } from 'components/TransactionManager/useCompleteTransaction';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'store/store';
import { useGetTxnStatusDetailsQuery } from 'store/thorswap/api';
import { GetTxnStatusDetailsParams, GetTxnStatusDetailsUpdateParams } from 'store/thorswap/types';
import { updateTransaction } from 'store/transactions/slice';
import { PendingTransactionType } from 'store/transactions/types';

export const useAdvancedTracker = (tx: PendingTransactionType | null) => {
  const appDispatch = useAppDispatch();
  const {
    id,
    txid,
    type,
    label,
    quoteId,
    route,
    details,
    sellAmountNormalized,
    completed,
    timestamp,
    from,
    recipient,
    streamingSwap,
  } = tx || {};

  const hasDetailsParams = txid && route && quoteId;
  const canFetchDetails = hasDetailsParams || (txid && !!details);
  const skipFetchingDetails = completed || !canFetchDetails;
  const { onCompleteTransaction } = useCompleteTransaction(tx);

  const detailsParams: GetTxnStatusDetailsParams | GetTxnStatusDetailsUpdateParams =
    details && txid
      ? { hash: txid }
      : {
          txn: {
            hash: txid || '',
            quoteId: quoteId || '',
            route,
            sellAmount: sellAmountNormalized || '0',
            startTimestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
            fromAddress: from || '',
            toAddress: recipient || '',
            isStreamingSwap: !!streamingSwap,
          },
        };

  const { data } = useTransactionDetails(detailsParams, skipFetchingDetails);

  useEffect(() => {
    if (!data) return;

    const transactionCompleted = data.done;
    const status = getSimpleTxStatus(data.status);

    if (transactionCompleted) {
      onCompleteTransaction({ status, details: data.result });
    } else {
      if (id) {
        const txDetails = data.result;
        appDispatch(updateTransaction({ id, details: txDetails }));
      }
    }
  }, [appDispatch, data, id, onCompleteTransaction]);

  return tx ? { type, label, details, txUrl: '' } : null;
};

export const useTransactionDetails = (
  params: GetTxnStatusDetailsParams | GetTxnStatusDetailsUpdateParams,
  skip?: boolean,
) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    data: resData,
    error,
    isLoading,
  } = useGetTxnStatusDetailsQuery(params, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    skip: !!skip || isCompleted,
  });

  const apiError = resData?.error
    ? { message: resData.error?.message || 'An error occured' }
    : null;

  const data = useMemo(() => {
    if (resData?.result?.legs && !resData.result.legs[0].startTimestamp) {
      resData.result.legs[0].startTimestamp = resData.result.startTimestamp;
    }

    return resData;
  }, [resData]);

  useEffect(() => {
    if (!data) return;

    if (data.done) {
      setIsCompleted(true);
    }
  }, [data]);

  return { data: apiError ? null : data, error: error || apiError, isLoading, isCompleted };
};
