import { TransactionType } from '@thorswap-lib/swapkit-api';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { t } from 'i18next';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

export const useTCApprove = ({ asset }: { asset: AssetEntity }) => {
  const { wallet } = useWallet();
  const appDispatch = useAppDispatch();
  const from = useMemo(() => wallet?.[asset.L1Chain as Chain]?.address, [wallet, asset.L1Chain]);

  const handleApprove = useCallback(async () => {
    if (from) {
      const id = v4();
      const inChain = asset.L1Chain;
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
          label: `${t('txManager.approve')} ${asset.name}`,
        }),
      );

      const { approveAsset } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await approveAsset(asset);

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
