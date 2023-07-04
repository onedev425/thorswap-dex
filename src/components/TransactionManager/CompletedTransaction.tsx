import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Icon, Link } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { TxDetailsButton } from 'components/TransactionManager/TxDetailsButton';
import { memo, useCallback, useEffect, useState } from 'react';
import { TxnResult } from 'store/thorswap/types';
import { CompletedTransactionType, TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';

import { cutTxPrefix, transactionTitle, useTxLabelUpdate } from './helpers';
import { TransactionStatusIcon } from './TransactionStatusIcon';

export const CompletedTransaction = memo(
  ({ inChain, type, txid, label, status, result, details, outChain }: CompletedTransactionType) => {
    const [transactionLabel, setTransactionLabel] = useState(label);
    const [{ txUrl, secondTxUrl }, setTxUrls] = useState({ txUrl: '', secondTxUrl: '' });

    const { wallet, refreshWalletByChain } = useWallet();

    const { handleLabelUpdate, isLoading } = useTxLabelUpdate({ result, setTransactionLabel });

    useEffect(() => {
      handleLabelUpdate();
    }, [handleLabelUpdate]);

    const transactionUrl = useCallback(async (tx: null | string = '', chain: Chain) => {
      if (!tx) return '';
      const { getExplorerTxUrl } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        return tx && getExplorerTxUrl(chain, cutTxPrefix(tx));
      } catch (error: NotWorth) {
        console.error(error);
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
        const txUrl = await transactionUrl(txid, inChain);
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
      
      if (wallet?.[inChain]) {
        refreshWalletByChain(inChain);
      }
      if (outChain && wallet?.[outChain]) {
        refreshWalletByChain(outChain);
      }
    }, [status, wallet, inChain, outChain, refreshWalletByChain]);

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
          <TxDetailsButton txid={details.firstTransactionHash} />
        ) : (
          <>
            {txUrl && (
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
