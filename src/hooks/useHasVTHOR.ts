import { BaseDecimal, SwapKitNumber } from '@swapkit/core';
import { useCallback, useEffect, useState } from 'react';
import { getVthorState } from 'views/Staking/hooks';

export const useVTHORBalance = (address?: string) => {
  const [VTHORBalance, setVTHORBalance] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const getVTHORBalance = useCallback(async () => {
    if (!address) return setVTHORBalance(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));

    try {
      const vTHORBalance = await getVthorState('balanceOf', [address]);
      setVTHORBalance(vTHORBalance);
    } catch (error: NotWorth) {
      console.error(error);
    }
  }, [address]);

  useEffect(() => {
    getVTHORBalance();
  }, [getVTHORBalance]);

  return VTHORBalance;
};
