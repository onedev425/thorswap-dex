import { Amount, Asset, QuoteMode, QuoteRoute } from '@thorswap-lib/multichain-core';
import { FeeOption, SupportedChain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { translateErrorMsg } from 'helpers/error';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useApp } from 'store/app/hooks';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

type SwapParams = {
  route?: QuoteRoute;
  quoteMode: QuoteMode;
  recipient: string;
  inputAsset: Asset;
  inputAmount: Amount;
  outputAsset: Asset;
  outputAmount: Amount;
};

export const gasFeeMultiplier: Record<FeeOption, number> = {
  average: 1.2,
  fast: 1.6,
  fastest: 2,
};

const quoteModeToTransactionType = {
  [QuoteMode.AVAX_TO_AVAX]: TransactionType.AVAX_STATUS,
  [QuoteMode.AVAX_TO_ETH]: TransactionType.AVAX_STATUS,
  [QuoteMode.AVAX_TO_TC_SUPPORTED]: TransactionType.AVAX_STATUS,
  [QuoteMode.ETH_TO_AVAX]: TransactionType.SWAP_ETH_TO_AVAX,
  [QuoteMode.ETH_TO_ETH]: TransactionType.SWAP_ETH_TO_ETH,
  [QuoteMode.ETH_TO_TC_SUPPORTED]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.TC_SUPPORTED_TO_AVAX]: TransactionType.SWAP_TC_TO_AVAX,
  [QuoteMode.TC_SUPPORTED_TO_ETH]: TransactionType.SWAP_TC_TO_ETH,
  [QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED]: TransactionType.SWAP_TC_TO_TC,
} as const;

export const useSwap = ({
  recipient,
  inputAsset,
  inputAmount,
  outputAsset,
  outputAmount,
  route,
  quoteMode,
}: SwapParams) => {
  const appDispatch = useAppDispatch();
  const { feeOptionType } = useApp();
  const { wallet } = useWallet();

  const handleSwap = useCallback(async () => {
    const id = v4();

    try {
      if (wallet && route) {
        const from = wallet?.[inputAsset.L1Chain as SupportedChain]?.address;
        if (!from) throw new Error('No address found');

        const label = `${inputAmount.toSignificant(6)} ${
          inputAsset.name
        } → ${outputAmount.toSignificant(6)} ${outputAsset.name}`;

        appDispatch(
          addTransaction({
            id,
            label,
            from,
            inChain: inputAsset.L1Chain,
            type: quoteModeToTransactionType[quoteMode as QuoteMode.ETH_TO_ETH],
          }),
        );

        const txid = await multichain().swapThroughAggregator({
          route,
          recipient,
          quoteMode,
          feeOptionKey: feeOptionType,
        });

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        } else {
          appDispatch(completeTransaction({ id, status: 'error' }));
          showErrorToast(t('notification.submitFail'), JSON.stringify(txid));
          if (typeof txid === 'object') console.info(txid);
        }
      }
    } catch (error: NotWorth) {
      const description = translateErrorMsg(error?.toString());
      appDispatch(completeTransaction({ id, status: 'error' }));

      showErrorToast(
        t('notification.submitFail'),
        description.includes('Object') ? '' : description,
      );
    }
  }, [
    wallet,
    route,
    inputAsset,
    outputAsset,
    quoteMode,
    inputAmount,
    outputAmount,
    recipient,
    feeOptionType,
    appDispatch,
  ]);

  return handleSwap;
};
