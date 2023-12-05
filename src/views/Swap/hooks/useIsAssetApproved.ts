import type { AssetValue } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import { useWallet } from 'context/wallet/hooks';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTransactionsState } from 'store/transactions/hooks';

type Params = {
  force?: boolean;
  assetValue: AssetValue;
  contract?: string;
};

export const checkAssetApprove = async ({ contract, assetValue }: Params) => {
  const { isAssetValueApproved } = await (await import('services/swapKit')).getSwapKitClient();
  const isApproved = await isAssetValueApproved(assetValue, contract);

  return isApproved;
};

let prevNumberOfPendingApprovals = 0;
let cachedResults: Record<string, boolean> = {};

const useApproveResult = ({
  isWalletConnected,
  numberOfPendingApprovals,
  assetValue,
  contract,
  skip,
}: {
  isWalletConnected: boolean;
  numberOfPendingApprovals: number;
  assetValue: AssetValue;
  contract?: string;
  skip: boolean;
}) => {
  const [isApproved, setApproved] = useState(assetValue.isGasAsset || !isWalletConnected);
  const [isLoading, setIsLoading] = useState(false);
  const cacheKey = useRef(`${assetValue.toString()}-${contract || 'all'}`);
  const currentParams = useRef<Params>({ assetValue, contract });
  currentParams.current = { assetValue, contract };

  const debouncedCheckAssetApprove = useRef(
    debounce(
      async () => {
        const isApproved = await checkAssetApprove(currentParams.current);

        setApproved(isApproved);
      },
      500,
      { leading: true, trailing: false },
    ),
  );

  const value = useMemo(() => assetValue.getValue('string'), [assetValue]);

  const checkApproved = useCallback(async () => {
    const cacheValue = cachedResults[cacheKey.current];
    if (cacheValue) {
      setIsLoading(false);
      return setApproved(cacheValue);
    }

    try {
      await debouncedCheckAssetApprove.current();
    } finally {
      prevNumberOfPendingApprovals = numberOfPendingApprovals;
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, numberOfPendingApprovals]);

  useEffect(() => {
    if (skip || !isWalletConnected) {
      setApproved(!skip);
    } else {
      setIsLoading(true);
      /**
       * Place a timeout to avoid the case where the user approves the asset
       * and rpc returns the old state. This will cause the UI to show the
       * approve button again.
       */

      const timeoutDuration = prevNumberOfPendingApprovals > numberOfPendingApprovals ? 10000 : 0;

      setTimeout(() => checkApproved(), timeoutDuration);
    }
  }, [value, checkApproved, isWalletConnected, numberOfPendingApprovals, skip]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, assetValue }: Params) => {
  const { getWalletAddress } = useWallet();
  const { numberOfPendingApprovals } = useTransactionsState();
  const walletAddress = useMemo(
    () => getWalletAddress(assetValue.chain as Chain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetValue.chain],
  );

  const possibleApprove = useMemo(
    () =>
      !assetValue.isGasAsset ||
      [Chain.Ethereum, Chain.Avalanche, Chain.BinanceSmartChain].includes(assetValue.chain),
    [assetValue.chain, assetValue.isGasAsset],
  );

  const { isApproved, isLoading } = useApproveResult({
    isWalletConnected: !!walletAddress,
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : false,
    assetValue,
    contract: possibleApprove ? contract : undefined,
  });

  return {
    isApproved,
    isWalletConnected: !!walletAddress,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};
