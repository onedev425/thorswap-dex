import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTransactionsState } from 'store/transactions/hooks';
import { useWallet } from 'store/wallet/hooks';

type Params = {
  force?: boolean;
  asset: AssetEntity;
  contract?: string;
};

const checkAssetApprove = async ({ contract, asset }: Params) => {
  const { isAssetApprovedForContract, isAssetApproved } = await (
    await import('services/multichain')
  ).getSwapKitClient();

  return await (contract ? isAssetApprovedForContract(asset, contract) : isAssetApproved(asset));
};

let prevNumberOfPendingApprovals = 0;
let cachedResults: Record<string, boolean> = {};

const useApproveResult = ({
  isWalletConnected,
  numberOfPendingApprovals,
  asset,
  contract,
  skip,
}: {
  isWalletConnected: boolean;
  numberOfPendingApprovals: number;
  asset: AssetEntity;
  contract?: string;
  skip: boolean;
}) => {
  const [isApproved, setApproved] = useState(isWalletConnected ? null : true);
  const [isLoading, setIsLoading] = useState(false);
  const cacheKey = useMemo(() => `${asset.symbol}-${contract || 'all'}`, [asset.symbol, contract]);

  const debouncedCheckAssetApprove = useRef(
    debounce(checkAssetApprove, 1000, { leading: true, trailing: false }),
  );

  const checkApproved = useCallback(async () => {
    if (cachedResults[cacheKey]) {
      setIsLoading(false);
      return setApproved(cachedResults[cacheKey]);
    }

    try {
      const approved = await debouncedCheckAssetApprove.current({ asset, contract });

      cachedResults[cacheKey] = !!approved;
      setApproved(!!approved);
    } finally {
      prevNumberOfPendingApprovals = numberOfPendingApprovals;
      setIsLoading(false);
    }
  }, [asset, cacheKey, contract, debouncedCheckAssetApprove, numberOfPendingApprovals]);

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
      const timeoutDuration = prevNumberOfPendingApprovals > numberOfPendingApprovals ? 15000 : 0;

      setTimeout(() => checkApproved(), timeoutDuration);
    }
  }, [checkApproved, isWalletConnected, numberOfPendingApprovals, skip]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, asset }: Params) => {
  const { wallet } = useWallet();
  const { numberOfPendingApprovals } = useTransactionsState();
  const walletAddress = useMemo(() => wallet?.[asset.L1Chain]?.address, [asset.L1Chain, wallet]);

  const possibleApprove = useMemo(
    () =>
      !asset.isETH() &&
      !asset.isAVAX() &&
      [Chain.Ethereum, Chain.Avalanche].includes(asset.L1Chain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset, contract],
  );

  const { isApproved, isLoading } = useApproveResult({
    isWalletConnected: !!walletAddress,
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : false,
    asset,
    contract: possibleApprove ? contract : undefined,
  });

  return {
    isApproved,
    isWalletConnected: !!walletAddress,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};
