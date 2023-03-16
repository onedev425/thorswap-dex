import { cutTxPrefix } from 'components/TransactionManager/helpers';
import { useTxUrl } from 'hooks/useTxUrl';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from 'store/store';
import { useGetTxnStatusQuery } from 'store/thorswap/api';
import { completeTransaction } from 'store/transactions/slice';
import { PendingTransactionType, TransactionType } from 'store/transactions/types';

export const useSimpleTracker = (tx: PendingTransactionType | null) => {
  const appDispatch = useAppDispatch();
  const { id, inChain, txid, type, label, from } = tx || {};

  const params = useMemo(() => {
    if (!txid || !type) return { txid: '' };

    const isApprove = [TransactionType.AVAX_APPROVAL, TransactionType.ETH_APPROVAL].includes(type);

    const shouldCutTx =
      type &&
      [
        TransactionType.SWAP_TC_TO_TC,
        TransactionType.SWAP_TC_TO_AVAX,
        TransactionType.SWAP_TC_TO_ETH,
      ].includes(type);

    const evmTx = txid.startsWith('0x') ? txid : `0x${txid}`;

    return {
      from,
      type,
      txid: cutTxPrefix(isApprove ? evmTx : txid, shouldCutTx ? '0x' : ''),
    };
  }, [from, txid, type]);

  const { data } = useGetTxnStatusQuery(params, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    skip: !params.txid,
  });

  const txUrl = useTxUrl({ txHash: tx?.id || '', chain: inChain });

  useEffect(() => {
    const transactionCompleted = data?.ok && ['mined', 'refund'].includes(data.status);
    const instantComplete = type && [TransactionType.TC_SEND].includes(type);
    const status = data?.status || 'mined';

    if (transactionCompleted || (instantComplete && txUrl)) {
      if (id) {
        appDispatch(completeTransaction({ id, status, result: data?.result }));
      }
    }
  }, [appDispatch, data, id, txUrl, txid, type]);

  return tx ? { type, label, txUrl, details: null } : null;
};
