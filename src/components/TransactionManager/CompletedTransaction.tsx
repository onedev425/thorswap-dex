import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { memo, useEffect, useState } from 'react';
import { multichain } from 'services/multichain';
import { CompletedTransactionType } from 'store/transactions/types';

import { cutTxPrefix, transactionTitle, useTxIDFromResult, useTxLabelUpdate } from './helpers';
import { TransactionStatusIcon } from './TransactionStatusIcon';

export const CompletedTransaction = memo(
  ({ inChain, outChain, type, txid, label, status, result }: CompletedTransactionType) => {
    const [transactionLabel, setTransactionLabel] = useState(label);

    const { handleLabelUpdate, isLoading } = useTxLabelUpdate({
      result,
      inChain,
      outChain,
      setTransactionLabel,
    });

    useEffect(() => {
      handleLabelUpdate();
    }, [handleLabelUpdate]);

    const txUrl = {
      url: txid && multichain().getExplorerTxUrl(inChain, cutTxPrefix(txid || '')),
      icon: inChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const;

    const secondTxid = useTxIDFromResult({ result, txid });

    const secondUrl = {
      url:
        outChain && secondTxid && multichain().getExplorerTxUrl(outChain, cutTxPrefix(secondTxid)),
      icon: outChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const;

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

        {txUrl.url ? (
          <Link
            external
            className="inline-flex"
            onClick={(e) => e.stopPropagation()}
            to={txUrl.url}
          >
            <Icon className={baseHoverClass} color="secondary" name={txUrl.icon} size={18} />
          </Link>
        ) : null}

        {secondUrl.url ? (
          <Link
            external
            className="inline-flex"
            onClick={(e) => e.stopPropagation()}
            to={secondUrl.url}
          >
            <Icon className={baseHoverClass} color="secondary" name={secondUrl.icon} size={18} />
          </Link>
        ) : null}
      </Box>
    );
  },
);
