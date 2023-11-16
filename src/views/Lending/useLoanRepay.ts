import type { SwapKitNumber } from '@swapkit/core';
import { AssetValue } from '@swapkit/core';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import type { RepayQuoteResponse } from 'store/thorswap/types';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

export function useLoanRepay({
  repayAsset,
  collateralAsset,
  amount,
  onSuccess,
  repayQuote,
  stream,
}: {
  repayAsset: AssetValue;
  collateralAsset: AssetValue;
  amount: SwapKitNumber;
  onSuccess?: () => void;
  repayQuote?: RepayQuoteResponse;
  stream?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const appDispatch = useAppDispatch();
  const { wallet } = useWallet();

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.chain]?.address || '',
    [wallet, collateralAsset.chain],
  );

  const handleRepay = useCallback(
    async (expectedAmount: string) => {
      const { loan } = await (await import('services/swapKit')).getSwapKitClient();
      setIsConfirmOpen(false);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: t('txManager.closeLoan', {
            asset: repayAsset.ticker,
            amount: expectedAmount,
          }),
          type: TransactionType.TC_LENDING_CLOSE,
          inChain: repayAsset.chain,
        }),
      );

      try {
        const txid = await loan({
          type: 'close',
          memo: stream ? repayQuote?.streamingSwap?.memo : repayQuote?.memo,
          assetValue: AssetValue.fromStringSync(
            repayAsset.toString(),
            repayAsset.getValue('string'),
          )!.add(amount),
          minAmount: AssetValue.fromStringSync(repayAsset.toString(), expectedAmount)!,
        });
        onSuccess?.();
        if (txid)
          appDispatch(
            updateTransaction({
              id,
              txid,
              timestamp: new Date(),
              advancedTracker: true,
              initialPayload: repayQuote
                ? { isLending: true, ...repayQuote, fromAddress: collateralAddress }
                : undefined,
              type: TransactionType.TC_LENDING_CLOSE,
            }),
          );
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [appDispatch, repayAsset, stream, repayQuote, amount, onSuccess, collateralAddress],
  );

  const openRepayConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const closeRepayConfirm = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  return { handleRepay, isConfirmOpen, openRepayConfirm, closeRepayConfirm };
}
