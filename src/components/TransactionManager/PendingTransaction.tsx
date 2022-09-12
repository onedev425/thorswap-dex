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
    const params = useMemo(() => {
      if (!txid) return { from, type, txid: '' };

      const shouldCutTx = [TransactionType.SWAP_TC_TO_TC, TransactionType.SWAP_TC_TO_ETH].includes(
        type,
      );

      const tx =
        type === TransactionType.ETH_APPROVAL ? (txid.startsWith('0x') ? txid : `0x${txid}`) : txid;

      return { from, type, txid: cutTxPrefix(tx, shouldCutTx ? '0x' : '') };
    }, [from, txid, type]);

    const { data } = useGetTxnStatusQuery(params, {
      pollingInterval: 3000,
      refetchOnFocus: true,
      skip: !params.txid,
    });

    const appDispatch = useAppDispatch();

    const url = params.txid && multichain().getExplorerTxUrl(inChain, params.txid);

    useEffect(() => {
      if (data?.ok && ['mined', 'refund'].includes(data.status) && data.result) {
        appDispatch(completeTransaction({ id, status: data.status, result: data.result }));
      }
    }, [appDispatch, data, id, txid]);

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

        {url ? (
          <Link className="inline-flex" onClick={(e) => e.stopPropagation()} to={url}>
            <Icon
              className={baseHoverClass}
              color="secondary"
              name={txid?.startsWith('0x') ? 'etherscanLight' : 'external'}
              size={18}
            />
          </Link>
        ) : null}
      </Box>
    );
  },
);
