import { useCallback, useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { getVthorState } from 'views/StakeVThor/utils';

export const useVTHORBalance = (address?: string) => {
  const [VTHORBalance, setVTHORBalance] = useState(0);
  const getVTHORBalance = useCallback(async () => {
    if (!address) return setVTHORBalance(0);

    try {
      const vTHORBalance = fromWei(await getVthorState('balanceOf', [address]));
      setVTHORBalance(vTHORBalance);
    } catch (error) {
      setVTHORBalance(0);
    }
  }, [address]);

  useEffect(() => {
    getVTHORBalance();
  }, [getVTHORBalance]);

  return VTHORBalance;
};
