import type { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetAmount } from '@thorswap-lib/swapkit-core';
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
  repayAsset: AssetEntity;
  collateralAsset: AssetEntity;
  amount: Amount;
  onSuccess?: () => void;
  repayQuote?: RepayQuoteResponse;
  stream?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const appDispatch = useAppDispatch();
  const { wallet } = useWallet();

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );

  const handleRepay = useCallback(
    async (expectedAmount: string) => {
      const { closeLoan } = await (await import('services/swapKit')).getSwapKitClient();
      setIsConfirmOpen(false);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: t('txManager.closeLoan', {
            asset: repayAsset.name,
            amount: expectedAmount,
          }),
          type: TransactionType.TC_LENDING_CLOSE,
          inChain: repayAsset.L1Chain,
        }),
      );

      try {
        const txid = await closeLoan({
          memo: stream ? repayQuote?.streamingSwap?.memo : repayQuote?.memo,
          assetAmount: new AssetAmount(repayAsset, amount),
          assetTicker: `${collateralAsset.chain}.${collateralAsset.ticker}`,
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
    [
      appDispatch,
      repayAsset,
      stream,
      repayQuote,
      amount,
      collateralAsset.chain,
      collateralAsset.ticker,
      onSuccess,
      collateralAddress,
    ],
  );

  const openRepayConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const closeRepayConfirm = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  return { handleRepay, isConfirmOpen, openRepayConfirm, closeRepayConfirm };
}
