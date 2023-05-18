import { validateTHORName } from '@thorswap-lib/swapkit-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useState } from 'react';
import { useLazyGetTNSDetailQuery } from 'store/midgard/api';
import { THORNameEntry } from 'types/app';

export const useAddressForTNS = (address: string) => {
  const debouncedAddress = useDebouncedValue(address, 1200);
  const [loading, setLoading] = useState(false);
  const [TNS, setTNS] =
    useState<
      Maybe<{ entries?: THORNameEntry[]; owner?: string; expire?: string; thorname: string }>
    >(null);

  const [getTNSDetail] = useLazyGetTNSDetailQuery();

  const lookupForTNS = useCallback(
    async (providedThorname: string) => {
      try {
        const { data: details } = await getTNSDetail(providedThorname);
        const payload =
          typeof details === 'boolean'
            ? { thorname: providedThorname }
            : { ...(details || {}), thorname: providedThorname };
        setTNS(payload);
      } catch {
        setTNS(null);
      } finally {
        setLoading(false);
      }
    },
    [getTNSDetail],
  );

  useEffect(() => {
    const [possibleThorname] = debouncedAddress.toLowerCase().split('.');

    if (validateTHORName(possibleThorname)) {
      getTNSDetail(possibleThorname)
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
  }, [debouncedAddress, getTNSDetail, lookupForTNS]);

  useEffect(() => {
    if (validateTHORName(address)) {
      setLoading(true);
    }
  }, [address]);

  return { loading, TNS, setTNS };
};
