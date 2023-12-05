import { useMemo } from 'react';
import { useGetNetworkQuery } from 'store/midgard/api';

export const useCheckHardCap = () => {
  const hardCapPercentage = useHardCapPercentage();

  const isHardCapReached = useMemo(() => hardCapPercentage >= 100, [hardCapPercentage]);

  return isHardCapReached;
};

export const useHardCapPercentage = () => {
  const { data: networkData } = useGetNetworkQuery();

  return useMemo(() => {
    const activeBonds = networkData?.activeBonds;
    const numActiveBonds = activeBonds?.map((string) => parseInt(string));

    const sortedBonds = numActiveBonds?.sort((a, b) => a - b);
    const securityBonds = sortedBonds?.slice(0, (sortedBonds?.length * 2) / 3);
    const effectiveSecurityBond = securityBonds?.reduce((acc, bond) => acc + bond, 0) || 0;
    return (Number(networkData?.totalPooledRune) / effectiveSecurityBond) * 100;
  }, [networkData?.activeBonds, networkData?.totalPooledRune]);
};
