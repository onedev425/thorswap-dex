import type { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetAmount } from '@thorswap-lib/swapkit-core';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

export function useLoanRepay({
  repayAsset,
  amount,
  onSuccess,
}: {
  repayAsset: AssetEntity;
  amount: Amount;
  onSuccess?: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const appDispatch = useAppDispatch();

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
          assetAmount: new AssetAmount(repayAsset, amount),
          assetTicker: `${repayAsset.chain}.${repayAsset.ticker}`,
        });
        // setAmount(Amount.fromAssetAmount(0, 8));
        onSuccess?.();
        if (txid) appDispatch(updateTransaction({ id, txid }));
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [appDispatch, repayAsset, amount, onSuccess],
  );

  const openRepayConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const closeRepayConfirm = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  return { handleRepay, isConfirmOpen, openRepayConfirm, closeRepayConfirm };
}
