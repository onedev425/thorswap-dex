import type { TxTrackerDetails } from '@swapkit/api';
import { TxStatus } from '@swapkit/api';
import { AssetValue } from '@swapkit/core';
import { getSimpleTxStatus } from 'components/TransactionManager/helpers';
import { useCompleteTransaction } from 'components/TransactionManager/useCompleteTransaction';
import type {
  TrackerPayload,
  TxDetails,
  TxnMeta,
  TxnTransient,
} from 'components/TransactionTrackerV2/types';
import { TrackingStatus } from 'components/TransactionTrackerV2/types';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'store/store';
import { useGetTxStatusV2Query } from 'store/thorswap/api';
import { updateTransaction } from 'store/transactions/slice';
import type { PendingTransactionType } from 'store/transactions/types';

export const useTrackerV2 = (tx: PendingTransactionType | null) => {
  const appDispatch = useAppDispatch();
  const { id, txid, type, label, route, details, completed } = tx || {};

  // @ts-expect-error
  const sellAssetString = route?.sellAsset || '';
  const canFetchDetails = !!txid && !!sellAssetString;
  const { onCompleteTransaction } = useCompleteTransaction(tx);
  const sellAsset = sellAssetString ? AssetValue.fromStringSync(sellAssetString) : null;

  const chainId = sellAsset?.chainId();

  const skipFetchingDetails = completed || !canFetchDetails || !chainId;

  const txnPayload: TrackerPayload | null =
    canFetchDetails && sellAsset && chainId
      ? {
          // TODO: handle polkadot
          // block: 0
          hash: txid,
          chainId,
        }
      : null;

  const { data, isCompleted } = useTransactionDetailsV2(txnPayload, skipFetchingDetails);

  useEffect(() => {
    if (!data) return;

    const status = getSimpleTxStatus(data.status || TxStatus.PENDING);

    if (isCompleted) {
      onCompleteTransaction({ status, details: data });
    } else {
      if (id) {
        const txDetails = data;
        appDispatch(updateTransaction({ id, details: txDetails }));
      }
    }
  }, [appDispatch, data, id, isCompleted, onCompleteTransaction]);

  return tx
    ? { type, label, details, txUrl: data?.meta?.explorerUrl, transient: data?.transient }
    : null;
};

export const useTransactionDetailsV2 = (payload: TrackerPayload | null, skip?: boolean) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    data: resData,
    error,
    isLoading,
  } = useGetTxStatusV2Query(payload, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    skip: !!skip || isCompleted || !payload,
  });

  const apiError =
    resData?.trackingStatus === TrackingStatus.parsing_error
      ? { message: 'An error occured' }
      : null;

  const data = useMemo(() => {
    // map to old schema
    return resData ? mapToV1TrackerDetails(resData) : null;
  }, [resData]);

  useEffect(() => {
    if (!data) return;

    if (data.status !== TxStatus.PENDING && data.status !== TxStatus.UNKNOWN) {
      setIsCompleted(true);
    }
  }, [data]);

  return { data: apiError ? null : data, error: error || apiError, isLoading, isCompleted };
};

function mapToV1TrackerDetails(
  payload: TxDetails,
): TxTrackerDetails & { transient?: TxnTransient; meta?: TxnMeta } {
  const estimatedFinalizedAt =
    payload.legs[1]?.transient?.estimatedFinalizedAt || Date.now() / 1000;
  const transient = payload.transient ? { ...payload.transient, estimatedFinalizedAt } : undefined;

  return {
    quoteId: '',
    firstTransactionHash: payload.hash,
    currentLegIndex: 0,
    legs: payload.legs.map(
      (leg) =>
        ({
          ...leg,
          status: mapTxStatusToV1Status(leg.trackingStatus),
        }) as any,
    ),
    status: mapTxStatusToV1Status(payload.trackingStatus),
    startTimestamp: null,
    estimatedDuration: null,
    isStreamingSwap: false,
    transient,
    meta: payload.meta,
  };
}

function mapTxStatusToV1Status(status?: TrackingStatus): TxStatus {
  switch (status) {
    case TrackingStatus.completed:
      return TxStatus.SUCCESS;

    case TrackingStatus.refunded:
    case TrackingStatus.partially_refunded:
      return TxStatus.REFUNDED;

    case TrackingStatus.retries_exceeded:
      return TxStatus.RETRIES_EXCEEDED;

    case TrackingStatus.parsing_error:
    case TrackingStatus.dropped:
      return TxStatus.UNKNOWN;

    case TrackingStatus.reverted:
      return TxStatus.ERROR;

    case TrackingStatus.replaced:
      return TxStatus.CANCELLED;
    default:
      return TxStatus.PENDING;
  }
}
