import { QuoteMode } from '@thorswap-lib/multichain-sdk';
import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { cutTxPrefix, transactionTitle } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import { memo, useEffect, useMemo } from 'react';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { useGetTxnStatusQuery } from 'store/thorswap/api';
import { completeTransaction } from 'store/transactions/slice';
import { PendingTransactionType } from 'store/transactions/types';

export const PendingTransaction = memo(
  ({ id, inChain, txid = '', type, from, label, quoteMode }: PendingTransactionType) => {
    const params = useMemo(() => {
      const isApprove = type === 'approve';
      const shouldCutTx =
        type === 'swap' &&
        quoteMode &&
        [QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED_TO, QuoteMode.TC_SUPPORTED_TO_ETH].includes(
          quoteMode,
        );

      const tx = txid.length
        ? !isApprove || (isApprove && txid.startsWith('0x'))
          ? txid
          : `0x${txid}`
        : '';

      return {
        from,
        quoteMode,
        txid: cutTxPrefix(tx, shouldCutTx ? '0x' : ''),
      };
    }, [from, quoteMode, txid, type]);

    const appDispatch = useAppDispatch();

    const { data } = useGetTxnStatusQuery(params, {
      pollingInterval: 3000,
      refetchOnFocus: true,
      skip: !params.txid,
    });

    const url = params.txid && multichain().getExplorerTxUrl(inChain, params.txid);

    useEffect(() => {
      if (data?.ok && data.result) {
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
