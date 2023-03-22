import { validateTHORName } from '@thorswap-lib/swapkit-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useState } from 'react';
import { midgardApi } from 'services/midgard';
import { getThornameDetails } from 'services/thorname';
import { THORNameEntry } from 'types/app';

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

    if (validateTHORName(possibleThorname)) {
      midgardApi
        .getTHORNameDetail(possibleThorname)
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
    if (validateTHORName(address)) {
      setLoading(true);
    }
  }, [address]);

  return { loading, TNS, setTNS };
};
