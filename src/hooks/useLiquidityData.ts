import type { Chain } from '@swapkit/core';
import type { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import { useWallet } from 'context/wallet/hooks';
import { useMemo } from 'react';
import { useGetFullMemberQuery } from 'store/midgard/api';
import { LiquidityTypeOption } from 'store/midgard/types';

export const useLiquidityData = ({
  testAddresses,
}: {
  testAddresses?: { [key in Chain]: string };
} = {}) => {
  const { walletAddresses: connectedAddresses, isWalletLoading } = useWallet();

  const walletAddresses = useMemo(() => {
    const priorityAddresses = Object.values(testAddresses || {});

    return priorityAddresses.length > 0 ? priorityAddresses : connectedAddresses;
  }, [connectedAddresses, testAddresses]);

  const { data, isFetching, isLoading, refetch } = useGetFullMemberQuery(walletAddresses, {
    skip: !walletAddresses.length || isWalletLoading,
  });

  return { data, refetch, isLoading: isFetching || isLoading };
};

export const useLPMemberData = ({
  assetString,
  liquidityType,
}: {
  assetString: string;
  liquidityType: LiquidityTypeOption;
}) => {
  const { walletAddresses } = useWallet();
  const { data, refetch, isLoading } = useLiquidityData();
  const lpMemberData = useMemo(
    () =>
      data?.find(({ pool, runeAddress, assetAddress }) => {
        if (pool.toLowerCase() !== assetString.toLowerCase()) return false;
        if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
          return walletAddresses.includes(runeAddress) && walletAddresses.includes(assetAddress);
        }
        return true;
      }) || ({} as FullMemberPool),
    [assetString, data, walletAddresses, liquidityType],
  );
  const isRunePending = useMemo(
    () => parseInt(lpMemberData?.runePending || '0') > 0,
    [lpMemberData?.runePending],
  );

  const isAssetPending = useMemo(
    () => parseInt(lpMemberData?.assetPending || '0') > 0,
    [lpMemberData?.assetPending],
  );

  return {
    lpMemberData,
    isRunePending,
    isAssetPending,
    refetch,
    isLoading,
  };
};
