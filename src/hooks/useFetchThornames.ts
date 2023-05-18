import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetTNSByOwnerAddressQuery, useLazyGetTNSDetailQuery } from 'store/midgard/api';
import { useAppSelector } from 'store/store';
import { THORNameEntry } from 'types/app';

export const useFetchThornames = () => {
  const fetching = useRef(false);
  const [registeredThornames, setRegisteredThornames] = useState<
    null | { entries?: THORNameEntry[]; owner?: string; expire?: string; thorname: string }[]
  >(null);

  const thorAddress = useAppSelector(({ wallet }) => wallet?.wallet?.THOR?.address || '');

  const { data: thornames } = useGetTNSByOwnerAddressQuery(thorAddress);
  const [getTNSDetail] = useLazyGetTNSDetailQuery();

  const fetchRegisteredThornames = useCallback(async () => {
    if (!thornames || !thorAddress || fetching.current) return;
    fetching.current = true;

    try {
      const thornamesDetails = await Promise.all(
        thornames.map(async (name) => {
          const { data: details } = await getTNSDetail(name);
          return typeof details === 'boolean'
            ? { thorname: name }
            : { ...(details || {}), thorname: name };
        }),
      );

      setRegisteredThornames(thornamesDetails);
    } finally {
      fetching.current = false;
    }
  }, [getTNSDetail, thorAddress, thornames]);

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
