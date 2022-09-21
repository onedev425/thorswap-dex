import usePrevious from 'hooks/usePrevious';
import { useCallback, useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { getVthorState } from 'views/StakeVThor/utils';

export const useHasVTHOR = (address?: string) => {
  const previousAddress = usePrevious(address);
  const [hasVTHOR, setHasVTHOR] = useState(false);
  const getVTHORBalance = useCallback(async () => {
    if (!address || previousAddress !== address) setHasVTHOR(false);
    if (!address || (previousAddress === address && hasVTHOR)) return;

    try {
      const vTHORBalance = fromWei(await getVthorState('balanceOf', [address]));
      setHasVTHOR(vTHORBalance > 0);
    } catch (error) {
      setHasVTHOR(false);
    }
  }, [address, hasVTHOR, previousAddress]);

  useEffect(() => {
    getVTHORBalance();
  }, [address, getVTHORBalance]);

  return hasVTHOR;
};
