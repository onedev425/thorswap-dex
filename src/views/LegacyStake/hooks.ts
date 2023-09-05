import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import {
  ContractType,
  getCustomContract,
  getEtherscanContract,
  LPContractType,
} from 'services/contract';
import { useWallet } from 'store/wallet/hooks';

import type { FarmActionType } from './types';

const lpContractConfig: Record<LPContractType, { tokenAddr: string; stakingAddr: string }> = {
  [LPContractType.THOR]: {
    tokenAddr: '0xa5f2211B9b8170F694421f2046281775E8468044',
    stakingAddr: '0x6755630c583f12fFBD10568EB633c0319dB34922',
  },
  [LPContractType.THOR_ETH]: {
    // SUSHI SLP Address
    tokenAddr: '0x3D3F13F2529eC3C84B2940155EffBf9b39a8f3Ec',
    stakingAddr: '0xae1Fc3947Ee83aeb3b7fEC237BCC1D194C88BC24',
  },
};

export const getLPContractAddress = (contractType: LPContractType) =>
  lpContractConfig[contractType].tokenAddr.toLowerCase();

export const getLpTokenBalance = async (contractType: LPContractType) => {
  const { tokenAddr, stakingAddr } = lpContractConfig[contractType];

  const tokenContract = await getCustomContract(tokenAddr);
  return await tokenContract.balanceOf(stakingAddr);
};

export const useStakingModal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<null | FarmActionType>(null);

  const open = useCallback((type: FarmActionType) => {
    setConfirmActionType(type);
    setIsOpened(true);
  }, []);

  const close = useCallback(() => {
    setIsOpened(false);
    setTimeout(() => setConfirmActionType(null), 300);
  }, []);

  return { isOpened, type: confirmActionType, open, close };
};

export const useV1ThorStakeInfo = () => {
  const { wallet } = useWallet();
  const [stakedThorAmount, setStakedThorAmount] = useState<null | BigNumber>(null);

  const getStakedThorAmount = useCallback(async () => {
    if (wallet?.ETH?.address) {
      const ethereumAddr = wallet.ETH.address;

      // V1 $thor stake
      const stakingContract = await getEtherscanContract(ContractType.STAKING_THOR);
      const { amount } = await stakingContract.userInfo(0, ethereumAddr);

      setStakedThorAmount(amount as BigNumber);
    }
  }, [wallet]);

  useEffect(() => {
    getStakedThorAmount();
  }, [getStakedThorAmount]);

  const hasStakedV1Thor = !!stakedThorAmount && BigNumber.from(stakedThorAmount).gt(0);

  return { stakedThorAmount, hasStakedV1Thor };
};
