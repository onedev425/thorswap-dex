import type { Chain } from '@swapkit/core';
import { cutTxPrefix } from 'components/TransactionManager/helpers';
import { useCallback, useEffect, useState } from 'react';
import { logException } from 'services/logger';

type Props = {
  chain?: Chain;
  txHash: string;
};

export const useTxUrl = ({ chain, txHash }: Props) => {
  const [txUrl, setTxUrl] = useState('');

  const getTransactionUrl = useCallback(async (tx: null | string = '', chain: Chain) => {
    if (!tx) return '';
    const { getExplorerTxUrl } = await (await import('services/swapKit')).getSwapKitClient();

    try {
      return tx && getExplorerTxUrl(chain, cutTxPrefix(tx));
    } catch (error: NotWorth) {
      logException(`Can't get explorer tx url for chain ${chain}`);
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
