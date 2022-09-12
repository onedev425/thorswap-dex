import { Asset, QuoteMode } from '@thorswap-lib/multichain-sdk';
import { SupportedChain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

type Params = {
  inputAsset: Asset;
  quoteMode: QuoteMode;
  contract: string;
};

export const useSwapApprove = ({ inputAsset, contract, quoteMode }: Params) => {
  const appDispatch = useAppDispatch();
  const { wallet } = useWallet();

  const handleApprove = useCallback(async () => {
    const from = wallet?.[inputAsset.L1Chain as SupportedChain]?.address;
    if (from) {
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          from,
          label: `${t('txManager.approve')} ${inputAsset.name}`,
          inChain: inputAsset.L1Chain,
          type: TransactionType.ETH_APPROVAL,
        }),
      );

      try {
        const ethApproveNeeded = [QuoteMode.ETH_TO_TC_SUPPORTED, QuoteMode.ETH_TO_ETH].includes(
          quoteMode,
        );

        const txid = await (ethApproveNeeded
          ? multichain().approveAssetForStaking(inputAsset, contract)
          : multichain().approveAsset(inputAsset));

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [wallet, inputAsset, appDispatch, quoteMode, contract]);

  return handleApprove;
};
