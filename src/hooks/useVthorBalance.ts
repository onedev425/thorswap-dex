import { useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { getVthorState } from 'views/StakeVThor/utils';

export const useVthorBalance = (address?: string) => {
  const [balance, setBalance] = useState(0);
  const [hasVThor, setHasVThor] = useState(false);

  useEffect(() => {
    const getVthorBalance = async () => {
      if (!address) {
        setBalance(0);
        return;
      }
      const res = await getVthorState('balanceOf', [address]).catch(() => {
        setHasVThor(false);
        setBalance(0);
      });

      if (fromWei(res) > 0) {
        setHasVThor(true);
      }

      setBalance(fromWei(res));
    };

    getVthorBalance();
  }, [address]);

  return { balance, hasVThor };
};
