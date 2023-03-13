import { Amount, AssetEntity, QuoteMode, QuoteRoute } from '@thorswap-lib/swapkit-core';
import { Chain, FeeOption } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { translateErrorMsg } from 'helpers/error';
import { useCallback } from 'react';
import { t } from 'services/i18n';
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
  inputAsset: AssetEntity;
  inputAmount: Amount;
  outputAsset: AssetEntity;
  outputAmount: Amount;
};

export const gasFeeMultiplier: Record<FeeOption, number> = {
  average: 1.2,
  fast: 1.6,
  fastest: 2,
};

const quoteModeToTransactionType = {
  [QuoteMode.AVAX_TO_AVAX]: TransactionType.SWAP_AVAX_TO_AVAX,
  [QuoteMode.AVAX_TO_ETH]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_TC_SUPPORTED]: TransactionType.SWAP_AVAX_TO_TC,
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
        const from = wallet?.[inputAsset.L1Chain as Chain]?.address;
        if (!from) throw new Error('No address found');

        const label = `${inputAmount.toSignificantWithMaxDecimals(6)} ${
          inputAsset.name
        } → ${outputAmount.toSignificantWithMaxDecimals(6)} ${outputAsset.name}`;

        appDispatch(
          addTransaction({
            id,
            label,
            from,
            inChain: inputAsset.L1Chain,
            type: quoteModeToTransactionType[quoteMode as QuoteMode.ETH_TO_ETH],
          }),
        );

        const { swap, validateAddress } = await (
          await import('services/multichain')
        ).getSwapKitClient();

        try {
          const txid = await swap({
            route,
            quoteMode,
            feeOptionKey: feeOptionType,
            recipient: validateAddress({ chain: outputAsset.L1Chain, address: recipient })
              ? recipient
              : '',
          });

          if (typeof txid === 'string') {
            appDispatch(updateTransaction({ id, txid }));
          } else {
            appDispatch(completeTransaction({ id, status: 'error' }));
            showErrorToast(t('notification.submitFail'), JSON.stringify(txid));
            if (typeof txid === 'object') console.info(txid);
          }
        } catch (error) {
          console.error(error);
          appDispatch(completeTransaction({ id, status: 'error' }));

          showErrorToast(
            t('notification.submitFail'),
            // @ts-expect-error
            error?.code === 4001 ? t('notification.cancelledByUser') : error?.toString(),
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
