import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const useCheckHardCap = () => {
  const hardCapPercentage = useHardCapPercentage();
  return hardCapPercentage >= 100;
};

export const useHardCapPercentage = () => {
  const { networkData } = useMidgard();

  return useMemo(() => {
    const activeBonds = networkData?.activeBonds;
    const numActiveBonds = activeBonds?.map((string) => parseInt(string));

    const sortedBonds = numActiveBonds?.sort((a, b) => a - b);
    const securityBonds = sortedBonds?.slice(0, (sortedBonds?.length * 2) / 3);
    const effectiveSecurityBond = securityBonds?.reduce((acc, bond) => acc + bond, 0) || 0;
    return (Number(networkData?.totalPooledRune) / effectiveSecurityBond) * 100;
  }, [networkData?.activeBonds, networkData?.totalPooledRune]);
};
