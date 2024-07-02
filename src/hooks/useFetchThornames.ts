import { Chain } from "@swapkit/sdk";
import { useWallet } from "context/wallet/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetTNSByOwnerAddressQuery, useLazyGetTNSDetailQuery } from "store/midgard/api";
import type { THORNameEntry } from "types/app";

export const useFetchThornames = () => {
  const fetching = useRef(false);
  const [registeredThornames, setRegisteredThornames] = useState<
    null | { entries?: THORNameEntry[]; owner?: string; expire?: string; thorname: string }[]
  >(null);
  const { getWalletAddress } = useWallet();
  const thorAddress = getWalletAddress(Chain.THORChain);

  const [getTNSDetail] = useLazyGetTNSDetailQuery();
  const { data: thornames } = useGetTNSByOwnerAddressQuery(thorAddress, {
    skip: !thorAddress,
  });

  const fetchRegisteredThornames = useCallback(async () => {
    if (!(thornames && thorAddress) || fetching.current) return;
    fetching.current = true;

    try {
      const thornamesDetails = await Promise.all(
        thornames.map(async (name) => {
          const { data: details } = await getTNSDetail(name);

          return Array.isArray(details) || typeof details === "boolean"
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
  useEffect(() => {
    fetchRegisteredThornames();
  }, [fetchRegisteredThornames]);

  return registeredThornames;
};
