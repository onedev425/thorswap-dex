import { type AssetValue, Chain } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { logEvent, logException } from 'services/logger';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

type Params = {
  inputAsset: AssetValue;
  contract?: string;
};

export const useSwapApprove = ({ inputAsset, contract }: Params) => {
  const appDispatch = useAppDispatch();
  const { getWalletAddress } = useWallet();

  const handleApprove = useCallback(
    async (approveAmount?: number) => {
      const from = getWalletAddress(inputAsset.chain);
      if (from) {
        const id = v4();
        const inChain = inputAsset.chain;
        const type =
          inChain === Chain.Ethereum
            ? TransactionType.ETH_APPROVAL
            : inChain === Chain.Avalanche
              ? TransactionType.AVAX_APPROVAL
              : TransactionType.BSC_APPROVAL;

        appDispatch(
          addTransaction({
            id,
            from,
            inChain,
            type,
            label: `${t('txManager.approve')} ${inputAsset.ticker}`,
          }),
        );

        const { approveAssetValue } = await (await import('services/swapKit')).getSwapKitClient();

        try {
          const txid = await approveAssetValue(inputAsset.set(approveAmount || 0), contract);
          logEvent('swap_approve', { approveAmount, asset: inputAsset.toString() });

          if (typeof txid === 'string') {
            appDispatch(updateTransaction({ id, txid }));
          }
        } catch (error) {
          logEvent('swap_approve_failed', { error, approveAmount, asset: inputAsset.toString() });
          logException(error as Error);
          appDispatch(completeTransaction({ id, status: 'error' }));
          showErrorToast(t('notification.approveFailed'), undefined, undefined, error as Error);
        }
      }
    },
    [getWalletAddress, inputAsset, appDispatch, contract],
  );

  return handleApprove;
};
