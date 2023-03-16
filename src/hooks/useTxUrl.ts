import { Chain } from '@thorswap-lib/types';
import { cutTxPrefix } from 'components/TransactionManager/helpers';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  chain?: Chain;
  txHash: string;
};

export const useTxUrl = ({ chain, txHash }: Props) => {
  const [txUrl, setTxUrl] = useState('');

  const getTransactionUrl = useCallback(async (tx: null | string = '', chain: Chain) => {
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
      if (chain) {
        setTxUrl(await getTransactionUrl(txHash, chain));
      }
    };

    getTxUrl();
  }, [chain, getTransactionUrl, txHash]);

  return txUrl;
};
