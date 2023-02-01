import { THORName, THORNameEntry } from '@thorswap-lib/multichain-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useState } from 'react';
import { getThornameDetails } from 'services/thorname';

export const useAddressForTNS = (address: string) => {
  const debouncedAddress = useDebouncedValue(address, 1200);
  const [loading, setLoading] = useState(false);
  const [TNS, setTNS] =
    useState<
      Maybe<{ entries?: THORNameEntry[]; owner?: string; expire?: string; thorname: string }>
    >(null);

  const lookupForTNS = useCallback(
    async (providedThorname: string) => {
      try {
        const details = await getThornameDetails(providedThorname);
        const payload =
          typeof details === 'boolean'
            ? { thorname: providedThorname }
            : { ...details, thorname: providedThorname };
        setTNS(payload);
      } catch {
        setTNS(null);
      } finally {
        setLoading(false);
      }
    },
    [setTNS],
  );

  useEffect(() => {
    const [possibleThorname] = debouncedAddress.toLowerCase().split('.');

    if (THORName.isValidName(possibleThorname)) {
      getThornameDetails(possibleThorname)
        .then((details) => {
          const payload =
            typeof details === 'boolean'
              ? { thorname: possibleThorname }
              : { ...details, thorname: possibleThorname };
          setTNS(payload);
        })
        .catch(() => setTNS(null))
        .finally(() => setLoading(false));

      lookupForTNS(possibleThorname.toLowerCase());
    }
  }, [debouncedAddress, lookupForTNS]);

  useEffect(() => {
    if (THORName.isValidName(address)) {
      setLoading(true);
    }
  }, [address]);

  return { loading, TNS, setTNS };
};
