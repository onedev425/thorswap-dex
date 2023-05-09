import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback, useMemo, useState } from 'react';
import { ContractType, getEtherscanContract, triggerContractCall } from 'services/contract';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { useGetIsWhitelistedQuery, useGetMerkleProofQuery } from 'store/thorswap/api';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil';

import { AIRDROP_THOR_AMOUNT } from './constants';
import { airdropAssets, AirdropType } from './types';

export const useAirdrop = () => {
  const appDispatch = useAppDispatch();
  const { getRate } = useVthorUtil();
  const [airdropAction, setAirdropAction] = useState(AirdropType.CLAIM_AND_STAKE);
  const [isClaiming, setIsClaiming] = useState(false);

  const { wallet, setIsConnectModalOpen } = useWallet();

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

  const { currentData: isWhitelistedData, isFetching: isFetchingWhitelisted } =
    useGetIsWhitelistedQuery({ address: ethAddr }, { refetchOnMountOrArgChange: true });

  const { currentData: merkleProofData, isFetching: isFetchingMerkleProof } =
    useGetMerkleProofQuery(
      { address: ethAddr },
      { refetchOnMountOrArgChange: true },
    );

  const isWhitelisted = useMemo(() => !!isWhitelistedData?.whitelisted, [isWhitelistedData]);

  const handleClaim = useCallback(async () => {
    if (isWhitelisted) {
      setIsClaiming(true);
      const contractType =
        airdropAction === AirdropType.CLAIM
          ? ContractType.CLAIM_AIRDROP
          : ContractType.CLAIM_AND_STAKE_AIRDROP;
      const airdropContract = getEtherscanContract(contractType);
      const claimed = await airdropContract.claimed(ethAddr);

      if (claimed) {
        setIsClaiming(false);
        showErrorToast(t('notification.airdropClaimFailed'), t('views.airdrop.alreadyClaimed'));
        return;
      }

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          inChain: Chain.Ethereum,
          type: TransactionType.ETH_STATUS,
          label: `
            ${t('txManager.claim')} ${
            airdropAction === AirdropType.CLAIM
              ? AIRDROP_THOR_AMOUNT
              : (AIRDROP_THOR_AMOUNT * getRate()).toFixed(2)
          } ${airdropAssets[airdropAction].name}`,
        }),
      );

      try {
        const txHash = (await triggerContractCall(
          airdropAction === AirdropType.CLAIM
            ? ContractType.CLAIM_AIRDROP
            : ContractType.CLAIM_AND_STAKE_AIRDROP,
          airdropAction === AirdropType.CLAIM ? 'claim' : 'claimAndStake',
          [merkleProofData?.proof],
        )) as string;

        if (txHash) {
          appDispatch(updateTransaction({ id, txid: txHash }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'), t('common.defaultErrMsg'));
      }

      setIsClaiming(false);
    }
  }, [setIsClaiming, appDispatch, ethAddr, isWhitelisted, airdropAction, merkleProofData, getRate]);

  return {
    airdropAction,
    setAirdropAction,
    handleClaim,
    isClaiming,
    ethAddr,
    isFetchingWhitelisted,
    isFetchingMerkleProof,
    isWhitelisted,
    setIsConnectModalOpen,
  };
};
