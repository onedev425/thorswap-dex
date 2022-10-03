import classNames from 'classnames';
import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { memo, useCallback, useEffect, useState } from 'react';
import { multichain } from 'services/multichain';
import { CompletedTransactionType } from 'store/transactions/types';

import { cutTxPrefix, transactionTitle, useTxIDFromResult, useTxLabelUpdate } from './helpers';
import { TransactionStatusIcon } from './TransactionStatusIcon';

export const CompletedTransaction = memo(
  ({ inChain, type, txid, label, status, result }: CompletedTransactionType) => {
    const [transactionLabel, setTransactionLabel] = useState(label);

    const { handleLabelUpdate, isLoading } = useTxLabelUpdate({ result, setTransactionLabel });

    useEffect(() => {
      handleLabelUpdate();
    }, [handleLabelUpdate]);

    const transactionUrl = useCallback(
      (tx: null | string = '') => {
        if (!tx) return '';

        try {
          return tx && multichain().getExplorerTxUrl(inChain, cutTxPrefix(tx));
        } catch (_error) {
          return;
        }
      },
      [inChain],
    );

    const txUrl = transactionUrl(txid);
    const secondTxid = useTxIDFromResult({ result, txid });
    const secondTxUrl = transactionUrl(secondTxid);

    return (
      <Box alignCenter flex={1} justify="between">
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon size={20} status={status} />

          <Box col>
            <Box alignCenter row>
              <Typography
                className={classNames('text-[15px] pr-1 opacity-75 transition-all', {
                  '!opacity-100': isLoading,
                })}
                fontWeight="semibold"
              >
                {transactionTitle(type)}
              </Typography>
            </Box>

            <Typography color="secondary" fontWeight="semibold" variant="caption">
              {transactionLabel}
            </Typography>
          </Box>
        </Box>

        {txUrl && (
          <Link external className="inline-flex" onClick={(e) => e.stopPropagation()} to={txUrl}>
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}

        {secondTxUrl && (
          <Link
            external
            className="inline-flex"
            onClick={(e) => e.stopPropagation()}
            to={secondTxUrl}
          >
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}
      </Box>
    );
  },
);
