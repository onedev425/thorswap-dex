import { Text } from '@chakra-ui/react';
import { Chain } from '@swapkit/core';
import classNames from 'classnames';
import { Box, Icon, Link } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { TxDetailsButton } from 'components/TransactionManager/TxDetailsButton';
import { useWalletBalance } from 'context/wallet/hooks';
import { memo, useCallback, useEffect, useState } from 'react';
import { logException } from 'services/logger';
import type { TxnResult } from 'store/thorswap/types';
import type { CompletedTransactionType } from 'store/transactions/types';
import { TransactionType } from 'store/transactions/types';

import { cutTxPrefix, transactionTitle, useTxLabelUpdate } from './helpers';
import { TransactionStatusIcon } from './TransactionStatusIcon';

export const CompletedTransaction = memo(
  ({
    inChain,
    type,
    txid,
    label,
    status,
    result,
    details,
    outChain,
    txUrl: txUrlOverwrite,
  }: CompletedTransactionType) => {
    const [transactionLabel, setTransactionLabel] = useState(label);
    const [{ txUrl, secondTxUrl }, setTxUrls] = useState({ txUrl: '', secondTxUrl: '' });

    const { reloadAllWallets } = useWalletBalance();

    const { handleLabelUpdate, isLoading } = useTxLabelUpdate({ result, setTransactionLabel });

    useEffect(() => {
      handleLabelUpdate();
    }, [handleLabelUpdate]);

    const transactionUrl = useCallback(async (tx: null | string = '', chain: Chain) => {
      if (!tx) return '';
      const { getExplorerTxUrl } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        return tx && getExplorerTxUrl({ chain, txHash: cutTxPrefix(tx) });
      } catch (error: NotWorth) {
        logException(new Error(`Failed to get explorer tx url for chain: ${chain}`));
        return '';
      }
    }, []);

    const getTxIDFromResult = useCallback(
      ({ result, txid }: { txid?: string; result?: string | TxnResult }) => {
        if (typeof result === 'string' || !result?.type) return '';

        switch (result.type) {
          case TransactionType.SWAP_ETH_TO_ETH:
          case TransactionType.SWAP_ETH_TO_TC:
          case TransactionType.SWAP_TC_TO_ETH:
          case TransactionType.SWAP_TC_TO_TC:
            return txid !== result.transactionHash ? result.transactionHash : null;

          case TransactionType.TC_SAVINGS_ADD:
          case TransactionType.TC_SAVINGS_WITHDRAW:
          case TransactionType.TC_LP_ADD:
          case TransactionType.TC_LP_WITHDRAW:
            return txid !== result.txID ? result.txID : null;

          default:
            return '';
        }
      },
      [],
    );

    useEffect(() => {
      const getTxUrl = async () => {
        const txUrl = txUrlOverwrite || (await transactionUrl(txid, inChain));
        const secondTxUrl = await transactionUrl(
          getTxIDFromResult({ result, txid }),
          [
            TransactionType.TC_LP_ADD,
            TransactionType.TC_LP_WITHDRAW,
            TransactionType.TC_SAVINGS_ADD,
            TransactionType.TC_SAVINGS_WITHDRAW,
          ].includes(type)
            ? Chain.THORChain
            : inChain,
        );
        setTxUrls({ txUrl, secondTxUrl });
      };

      getTxUrl();
    }, [inChain, txid, transactionUrl, getTxIDFromResult, result, type]);

    useCallback(() => {
      const finished = ['mined', 'error', 'refund'].includes(status);
      if (!finished) return;

      reloadAllWallets([inChain, outChain]);
    }, [status, reloadAllWallets, inChain, outChain]);

    return (
      <Box alignCenter flex={1} justify="between">
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon size={20} status={status} />

          <Box col>
            <Box alignCenter row>
              <Text
                className={classNames('text-[15px] pr-1 opacity-75 transition-all', {
                  '!opacity-100': isLoading,
                })}
                fontWeight="semibold"
              >
                {transactionTitle(type)}
              </Text>
            </Box>

            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
              {transactionLabel}
            </Text>
          </Box>
        </Box>

        {details ? (
          details.legs?.length > 0 ? (
            <TxDetailsButton txid={details.firstTransactionHash} />
          ) : null
        ) : (
          <>
            {!!txUrl && (
              <Link
                external
                className="inline-flex"
                onClick={(e) => e.stopPropagation()}
                to={txUrl}
              >
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
          </>
        )}
      </Box>
    );
  },
);
