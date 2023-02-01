import { THORNameEntry } from '@thorswap-lib/multichain-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAddressThornames, getThornameDetails } from 'services/thorname';
import { useAppSelector } from 'store/store';

export const useFetchThornames = () => {
  const fetching = useRef(false);
  const [registeredThornames, setRegisteredThornames] = useState<
    null | { entries?: THORNameEntry[]; owner?: string; expire?: string; thorname: string }[]
  >(null);

  const thorAddress = useAppSelector(({ wallet }) => wallet?.wallet?.THOR?.address);

  const fetchRegisteredThornames = useCallback(async () => {
    if (!thorAddress || fetching.current) return;
    fetching.current = true;

    try {
      const thornames = await getAddressThornames(thorAddress);
      const thornamesDetails = await Promise.all(
        thornames.map(async (name) => {
          const details = await getThornameDetails(name);
          return typeof details === 'boolean' ? { thorname: name } : { ...details, thorname: name };
        }),
      );

      setRegisteredThornames(thornamesDetails);
    } finally {
      fetching.current = false;
    }
  }, [setRegisteredThornames, thorAddress]);

  useEffect(() => {
    if (thorAddress) {
      fetchRegisteredThornames();
    } else if (!thorAddress && registeredThornames) {
      setRegisteredThornames(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thorAddress]);

  return registeredThornames;
};
