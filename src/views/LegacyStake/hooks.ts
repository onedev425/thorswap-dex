import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import { ContractType, getEtherscanContract } from 'services/contract';
import { useWallet } from 'store/wallet/hooks';

import { FarmActionType } from './types';

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
      const stakingContract = getEtherscanContract(ContractType.STAKING_THOR);
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
