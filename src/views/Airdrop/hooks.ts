import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [claimed, setClaimed] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState(0);

  const { wallet, setIsConnectModalOpen } = useWallet();

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

  const { currentData: isWhitelistedData, isFetching: isFetchingWhitelisted } =
    useGetIsWhitelistedQuery({ address: ethAddr }, { refetchOnMountOrArgChange: true });

  const { currentData: merkleProofData, isFetching: isFetchingMerkleProof } =
    useGetMerkleProofQuery({ address: ethAddr }, { refetchOnMountOrArgChange: true });

  const isWhitelisted = useMemo(() => !!isWhitelistedData?.whitelisted, [isWhitelistedData]);

  const contractType = useMemo(
    () =>
      airdropAction === AirdropType.CLAIM
        ? ContractType.CLAIM_AIRDROP
        : ContractType.CLAIM_AND_STAKE_AIRDROP,
    [airdropAction],
  );

  const fetchClaimed = useCallback(async () => {
    const airdropContract = getEtherscanContract(contractType);
    const hasClaimed = await airdropContract.claimed(ethAddr);

    setClaimed(hasClaimed);

    setAirdropAmount(isWhitelisted && !hasClaimed ? AIRDROP_THOR_AMOUNT : 0);
  }, [contractType, ethAddr, setClaimed, isWhitelisted]);

  useEffect(() => {
    fetchClaimed();
  }, [fetchClaimed]);

  const handleClaim = useCallback(async () => {
    if (isWhitelisted) {
      setIsClaiming(true);
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
  }, [claimed, setIsClaiming, appDispatch, isWhitelisted, airdropAction, merkleProofData, getRate]);

  return {
    airdropAction,
    setAirdropAction,
    handleClaim,
    isClaiming,
    airdropAmount,
    ethAddr,
    isFetchingWhitelisted,
    isFetchingMerkleProof,
    isWhitelisted,
    setIsConnectModalOpen,
  };
};
