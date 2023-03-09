import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, Icon, Link } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { cutTxPrefix, transactionTitle } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'store/store';
import { useGetTxnStatusQuery } from 'store/thorswap/api';
import { completeTransaction } from 'store/transactions/slice';
import { PendingTransactionType, TransactionType } from 'store/transactions/types';

export const PendingTransaction = memo(
  ({ id, inChain, txid, type, label, from }: PendingTransactionType) => {
    const appDispatch = useAppDispatch();
    const [txUrl, setTxUrls] = useState('');

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

    const transactionUrl = useCallback(async (tx: null | string = '', chain: Chain) => {
      if (!tx) return '';
      const { getExplorerTxUrl } = await (await import('services/multichain')).getSwapKitClient();

      try {
        return tx && getExplorerTxUrl(chain, cutTxPrefix(tx));
      } catch (error: NotWorth) {
        console.error(error);
        return '';
      }
    }, []);

    useEffect(() => {
      const getTxUrl = async () => {
        setTxUrls(await transactionUrl(txid, inChain));
      };

      getTxUrl();
    }, [txid, transactionUrl, type, inChain]);

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
            <Text fontWeight="semibold">{transactionTitle(type)}</Text>

            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
              {label}
            </Text>
          </Box>
        </Box>

        {txUrl && (
          <Link external className="inline-flex" to={txUrl}>
            <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
          </Link>
        )}
      </Box>
    );
  },
);
