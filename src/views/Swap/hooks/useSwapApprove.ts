import { baseAmount } from '@thorswap-lib/helpers';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { getTokenAddress } from '@thorswap-lib/toolbox-evm';
import { AmountWithBaseDenom, Chain, EVMChain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

type Params = {
  inputAsset: AssetEntity;
  contract?: string;
};

const UINT96_MAX = '79228162514264337593543950335';

// Assets have different max approval amount than standard ERC20
const ContractMaxApprovalAmount: Record<string, AmountWithBaseDenom> = {
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': baseAmount(UINT96_MAX),
};

export const useSwapApprove = ({ inputAsset, contract }: Params) => {
  const appDispatch = useAppDispatch();
  const { wallet } = useWallet();

  const handleApprove = useCallback(async () => {
    const from = wallet?.[inputAsset.L1Chain as Chain]?.address;
    if (from) {
      const id = v4();
      const inChain = inputAsset.L1Chain;
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
          label: `${t('txManager.approve')} ${inputAsset.name}`,
        }),
      );

      const { approveAssetForContract, approveAsset } = await (
        await import('services/swapKit')
      ).getSwapKitClient();

      try {
        const tokenAddress = getTokenAddress(inputAsset, inputAsset.L1Chain as EVMChain);
        const txid = await (contract
          ? approveAssetForContract(
              inputAsset,
              contract,
              tokenAddress ? ContractMaxApprovalAmount[tokenAddress.toLowerCase()] : undefined,
            )
          : approveAsset(inputAsset));

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [wallet, inputAsset, appDispatch, contract]);

  return handleApprove;
};
