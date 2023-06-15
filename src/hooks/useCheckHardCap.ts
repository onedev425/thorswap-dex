import { useMidgard } from 'store/midgard/hooks';

export const useCheckHardCap = () => {
  const { networkData } = useMidgard();
  const activeBonds = networkData?.activeBonds;
  const numActiveBonds = activeBonds?.map((string) => parseInt(string));

  const sortedBonds = numActiveBonds?.sort((a, b) => a - b);
  const securityBonds = sortedBonds?.slice(0, (sortedBonds?.length * 2) / 3);
  const effectiveSecurityBond = securityBonds?.reduce((acc, bond) => acc + bond, 0) || 0;
  return Number(networkData?.totalPooledRune) > effectiveSecurityBond;
};
