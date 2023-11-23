import { TransactionType } from '@swapkit/api';
import type { AssetValue } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { useWallet } from 'context/wallet/hooks';
import { t } from 'i18next';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { v4 } from 'uuid';

export const useTCApprove = ({ asset }: { asset: AssetValue }) => {
  const { getWalletAddress } = useWallet();
  const appDispatch = useAppDispatch();
  const from = useMemo(() => getWalletAddress(asset.chain), [asset.chain, getWalletAddress]);

  const handleApprove = useCallback(async () => {
    if (from) {
      const id = v4();
      const inChain = asset.chain;
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
          label: `${t('txManager.approve')} ${asset.ticker}`,
        }),
      );

      const { approveAssetValue } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await approveAssetValue(asset);

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [from, asset, appDispatch]);

  return handleApprove;
};
