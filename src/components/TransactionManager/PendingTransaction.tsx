import { Chain } from '@thorswap-lib/types';
import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { cutTxPrefix, transactionTitle } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import { memo, useEffect, useMemo } from 'react';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { useGetTxnStatusQuery } from 'store/thorswap/api';
import { completeTransaction } from 'store/transactions/slice';
import { PendingTransactionType, TransactionType } from 'store/transactions/types';

export const PendingTransaction = memo(
  ({ id, inChain, txid, type, label, from }: PendingTransactionType) => {
    const appDispatch = useAppDispatch();

    const params = useMemo(() => {
      if (!txid) return { txid: '' };

      const isApprove = [TransactionType.AVAX_APPROVAL, TransactionType.ETH_APPROVAL].includes(
        type,
      );

      const shouldCutTx = [
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

    const transactionUrl = useMemo(() => {
      if (!txid) return '';
      const chain = [TransactionType.TC_LP_ADD, TransactionType.TC_LP_WITHDRAW].includes(type)
        ? Chain.THORChain
        : inChain;

      return multichain().getExplorerTxUrl(chain, cutTxPrefix(txid));
    }, [inChain, txid, type]);

    const secondUrl = useMemo(
      () =>
        txid &&
        [
          TransactionType.TC_LP_ADD,
          TransactionType.TC_LP_WITHDRAW,
          TransactionType.TC_SAVINGS_ADD,
          TransactionType.TC_SAVINGS_WITHDRAW,
        ].includes(type)
          ? multichain().getExplorerTxUrl(Chain.THORChain, cutTxPrefix(txid))
          : '',
      [txid, type],
    );

    useEffect(() => {
      const transactionCompleted = data?.ok && ['mined', 'refund'].includes(data.status);
      const instantComplete = [TransactionType.TC_SEND].includes(type);
      const status = data?.status || 'mined';

      if (transactionCompleted || (instantComplete && transactionUrl)) {
        appDispatch(completeTransaction({ id, status, result: data?.result }));
      }
    }, [appDispatch, data, id, transactionUrl, txid, type]);

    return (
      <Box alignCenter flex={1} justify="between">
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon size={20} status="pending" />

          <Box col className="gap-x-2">
            <Typography fontWeight="semibold">{transactionTitle(type)}</Typography>

            <Typography color="secondary" fontWeight="semibold" variant="caption">
              {label}
            </Typography>
          </Box>
        </Box>

        {transactionUrl && (
          <Link external className="inline-flex" to={transactionUrl}>
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}

        {secondUrl && (
          <Link external className="inline-flex" to={secondUrl}>
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}
      </Box>
    );
  },
);
