import { validateTNS } from '@swapkit/core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useState } from 'react';
import { useLazyGetTNSDetailQuery } from 'store/midgard/api';
import type { THORNameEntry } from 'types/app';

export const useAddressForTNS = (thornameOrAddress: string) => {
  const debouncedAddress = useDebouncedValue(thornameOrAddress, 1000);
  const [loading, setLoading] = useState(false);
  const [validThorname, setValidThorname] = useState('');
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
          Array.isArray(details) || typeof details === 'boolean'
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

    if (validateTNS(possibleThorname)) {
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
    if (validateTNS(thornameOrAddress)) {
      setLoading(true);
      setValidThorname(thornameOrAddress);
    }
  }, [thornameOrAddress]);

  return { loading, TNS, setTNS, validThorname };
};
