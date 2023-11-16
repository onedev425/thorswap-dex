// import { Chain, getSignatureAssetFor } from '@swapkit/core';
// import { showErrorToast } from 'components/Toast';
// import { fetchVthorApr } from 'helpers/staking';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   ContractType,
//   fromWei,
//   getEtherscanContract,
//   triggerContractCall,
// } from 'services/contract';
// import { t } from 'services/i18n';
// import { useAppDispatch } from 'store/store';
// import { useGetIsWhitelistedQuery, useGetMerkleProofQuery } from 'store/thorswap/api';
// import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
// import { TransactionType } from 'store/transactions/types';
// import { useWallet } from 'store/wallet/hooks';
// import { v4 } from 'uuid';
// import { useVthorUtil } from 'views/Staking/hooks';

// import { AIRDROP_THOR_AMOUNT } from './constants';
// import { AirdropType } from './types';

// export const useAirdrop = () => {
//   const appDispatch = useAppDispatch();
//   const { getRate, thorStaked } = useVthorUtil();
//   const [vthorApr, setVthorApr] = useState(0);
//   const [airdropAction, setAirdropAction] = useState(AirdropType.CLAIM_AND_STAKE);
//   const [isClaiming, setIsClaiming] = useState(false);
//   const [claimed, setClaimed] = useState(false);
//   const [airdropAmount, setAirdropAmount] = useState(0);

//   const { wallet, setIsConnectModalOpen } = useWallet();

//   const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

//   const { currentData: isWhitelistedData, isFetching: isFetchingWhitelisted } =
//     useGetIsWhitelistedQuery({ address: ethAddr }, { refetchOnMountOrArgChange: true });

//   const { currentData: merkleProofData, isFetching: isFetchingMerkleProof } =
//     useGetMerkleProofQuery({ address: ethAddr }, { refetchOnMountOrArgChange: true });

//   const isWhitelisted = useMemo(() => !!isWhitelistedData?.whitelisted, [isWhitelistedData]);

//   const contractType = useMemo(
//     () =>
//       airdropAction === AirdropType.CLAIM
//         ? ContractType.CLAIM_AIRDROP
//         : ContractType.CLAIM_AND_STAKE_AIRDROP,
//     [airdropAction],
//   );

//   const getVthorAPR = useCallback(async () => {
//     const stakedAmount = fromWei(thorStaked);

//     if (stakedAmount > 0) {
//       try {
//         const apr = await fetchVthorApr(stakedAmount);
//         setVthorApr(apr);
//       } catch (error: NotWorth) {
//         console.error(error);
//         setVthorApr(0);
//       }
//     }
//   }, [thorStaked]);

//   useEffect(() => {
//     getVthorAPR();
//   }, [getVthorAPR]);

//   const fetchClaimed = useCallback(async () => {
//     const airdropContract = await getEtherscanContract(contractType);
//     const hasClaimed = await airdropContract.claimed(ethAddr);

//     setClaimed(hasClaimed);

//     setAirdropAmount(isWhitelisted && !hasClaimed ? AIRDROP_THOR_AMOUNT : 0);
//   }, [contractType, ethAddr, setClaimed, isWhitelisted]);

//   useEffect(() => {
//     fetchClaimed();
//   }, [fetchClaimed]);

//   const handleClaim = useCallback(async () => {
//     if (isWhitelisted) {
//       setIsClaiming(true);
//       if (claimed) {
//         setIsClaiming(false);
//         showErrorToast(
//           t('notification.airdropClaimFailed'),
//           t('views.airdrop.alreadyClaimedNotification'),
//         );
//         return;
//       }

//       const aidropAsset = getSignatureAssetFor(
//         airdropAction === AirdropType.CLAIM ? 'ETH_THOR' : 'ETH_VTHOR',
//       );

//       const id = v4();

//       appDispatch(
//         addTransaction({
//           id,
//           inChain: Chain.Ethereum,
//           type: TransactionType.ETH_STATUS,
//           label: `
//             ${t('txManager.claim')} ${
//               airdropAction === AirdropType.CLAIM
//                 ? AIRDROP_THOR_AMOUNT
//                 : (AIRDROP_THOR_AMOUNT * getRate()).toFixed(2)
//             } ${aidropAsset.name}`,
//         }),
//       );

//       try {
//         const txHash = (await triggerContractCall(
//           airdropAction === AirdropType.CLAIM
//             ? ContractType.CLAIM_AIRDROP
//             : ContractType.CLAIM_AND_STAKE_AIRDROP,
//           airdropAction === AirdropType.CLAIM ? 'claim' : 'claimAndStake',
//           [merkleProofData?.proof],
//         )) as string;

//         if (txHash) {
//           appDispatch(updateTransaction({ id, txid: txHash }));
//         }
//       } catch (error) {
//         console.error(error);
//         appDispatch(completeTransaction({ id, status: 'error' }));
//         showErrorToast(t('notification.submitFail'), t('common.defaultErrMsg'));
//       }

//       setIsClaiming(false);
//     }
//   }, [claimed, setIsClaiming, appDispatch, isWhitelisted, airdropAction, merkleProofData, getRate]);

//   return {
//     airdropAction,
//     setAirdropAction,
//     handleClaim,
//     isClaiming,
//     claimed,
//     vthorApr,
//     airdropAmount,
//     ethAddr,
//     isFetchingWhitelisted,
//     isFetchingMerkleProof,
//     isWhitelisted,
//     setIsConnectModalOpen,
//   };
// };
