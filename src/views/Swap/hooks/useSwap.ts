import type { QuoteRoute } from '@swapkit/api';
import type { AssetValue } from '@swapkit/core';
import { QuoteMode } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { translateErrorMsg } from 'helpers/error';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

import { ledgerLiveSwap } from '../../../../ledgerLive/wallet/swap';

type SwapParams = {
  route?: QuoteRoute;
  quoteMode: QuoteMode;
  recipient: string;
  inputAsset: AssetValue;
  outputAsset: AssetValue;
  quoteId?: string;
  streamSwap?: boolean;
};

const quoteModeToTransactionType = {
  [QuoteMode.AVAX_TO_AVAX]: TransactionType.SWAP_AVAX_TO_AVAX,
  [QuoteMode.AVAX_TO_BSC]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_ETH]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_TC_SUPPORTED]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.BSC_TO_AVAX]: TransactionType.BSC_TRANSFER_TO_TC,
  [QuoteMode.BSC_TO_BSC]: TransactionType.SWAP_BSC_TO_BSC,
  [QuoteMode.BSC_TO_ETH]: TransactionType.SWAP_BSC_TO_ETH,
  [QuoteMode.BSC_TO_TC_SUPPORTED]: TransactionType.SWAP_BSC_TO_TC,
  [QuoteMode.ETH_TO_AVAX]: TransactionType.SWAP_ETH_TO_AVAX,
  [QuoteMode.ETH_TO_BSC]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.ETH_TO_ETH]: TransactionType.SWAP_ETH_TO_ETH,
  [QuoteMode.ETH_TO_TC_SUPPORTED]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.TC_SUPPORTED_TO_AVAX]: TransactionType.SWAP_TC_TO_AVAX,
  [QuoteMode.TC_SUPPORTED_TO_BSC]: TransactionType.SWAP_TC_TO_BSC,
  [QuoteMode.TC_SUPPORTED_TO_ETH]: TransactionType.SWAP_TC_TO_ETH,
  [QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED]: TransactionType.SWAP_TC_TO_TC,
} as const;

export const useSwap = ({
  recipient = '',
  inputAsset,
  outputAsset,
  route,
  quoteId,
  streamSwap,
}: SwapParams) => {
  const appDispatch = useAppDispatch();
  const { feeOptionType: feeOptionKey } = useApp();
  const { wallet } = useWallet();

  const handleSwap = useCallback(async () => {
    const id = v4();

    try {
      const from = wallet?.[inputAsset.chain as keyof typeof wallet]?.address;
      if (!from && route) {
        if (!from) throw new Error('No address found');

        const label = `${inputAsset.toSignificant(6)} ${
          inputAsset.ticker
        } → ${outputAsset.toSignificant(6)} ${outputAsset.ticker}`;

        const { swap, validateAddress } = await (
          await import('services/swapKit')
        ).getSwapKitClient();

        const validAddress = validateAddress({ chain: outputAsset.chain, address: recipient });
        if (typeof validAddress === 'boolean' && !validAddress) {
          throw new Error('Invalid recipient address');
        }

        const swapMethod = IS_LEDGER_LIVE ? ledgerLiveSwap : swap;

        appDispatch(
          addTransaction({
            id,
            label,
            from,
            inChain: inputAsset.chain,
            type: quoteModeToTransactionType[route.meta.quoteMode as QuoteMode.ETH_TO_ETH],
            quoteId,
            sellAmount: inputAsset.toSignificant(),
            sellAmountNormalized: inputAsset.toSignificant(6),
            recipient: recipient || from,
            streamingSwap: streamSwap,
          }),
        );

        try {
          const txid = await swapMethod({ feeOptionKey, recipient, route, streamSwap, wallet });

          if (typeof txid === 'string') {
            const timestamp = new Date();
            appDispatch(
              updateTransaction({ id, txid, quoteId, route, timestamp, advancedTracker: true }),
            );
          } else {
            appDispatch(completeTransaction({ id, status: 'error' }));
            showErrorToast(t('notification.submitFail'), JSON.stringify(txid));
          }
        } catch (error: any) {
          console.error(error);
          appDispatch(completeTransaction({ id, status: 'error' }));
          const userCancelled = error?.code === 4001 || error?.toString().includes('4001');

          showErrorToast(
            t('notification.submitFail'),
            userCancelled ? t('notification.cancelledByUser') : error?.toString(),
          );
        }
      }
    } catch (error: NotWorth) {
      console.error(error);
      const description = translateErrorMsg(error?.toString());
      appDispatch(completeTransaction({ id, status: 'error' }));

      showErrorToast(
        t('notification.submitFail'),
        description.includes('Object') ? '' : description,
      );
    }
  }, [
    wallet,
    inputAsset,
    route,
    outputAsset,
    recipient,
    appDispatch,
    quoteId,
    streamSwap,
    feeOptionKey,
  ]);

  return handleSwap;
};
