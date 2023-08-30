import { baseAmount } from '@thorswap-lib/helpers';
import { Amount, AssetEntity, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { isAVAXAsset, isBSCAsset, isETHAsset } from 'helpers/assets';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTransactionsState } from 'store/transactions/hooks';
import { useWallet } from 'store/wallet/hooks';

type Params = {
  force?: boolean;
  asset: AssetEntity;
  contract?: string;
  amount?: Amount;
};

const checkAssetApprove = async ({ contract, asset, amount }: Params) => {
  const { isAssetApprovedForContract, isAssetApproved } = await (
    await import('services/swapKit')
  ).getSwapKitClient();

  const approveAmount = amount ? baseAmount(amount.baseAmount.toFixed() || '0') : undefined;

  return contract
    ? isAssetApprovedForContract(asset, contract, approveAmount)
    : isAssetApproved(asset, approveAmount);
};

let prevNumberOfPendingApprovals = 0;
let cachedResults: Record<string, boolean> = {};

const useApproveResult = ({
  isWalletConnected,
  numberOfPendingApprovals,
  asset,
  amount,
  contract,
  skip,
}: {
  isWalletConnected: boolean;
  numberOfPendingApprovals: number;
  asset: AssetEntity;
  amount?: Amount;
  contract?: string;
  skip: boolean;
}) => {
  const [isApproved, setApproved] = useState(isGasAsset(asset) || !isWalletConnected);
  const [isLoading, setIsLoading] = useState(false);
  const cacheKey = useRef(`${asset.symbol}-${contract || 'all'}`);
  const currentParams = useRef<Params>({ asset, amount, contract });

  const debouncedCheckAssetApprove = useRef(
    debounce(
      async () => {
        const isApproved = await checkAssetApprove(currentParams.current);
        console.info({ isApproved, params: currentParams.current });
        setApproved(isApproved);
      },
      500,
      { leading: true, trailing: false },
    ),
  );

  const checkApproved = useCallback(async () => {
    const cacheValue = cachedResults[cacheKey.current];
    if (cacheValue) {
      setIsLoading(false);
      return setApproved(cacheValue);
    }

    try {
      currentParams.current = { asset, amount, contract };
      await debouncedCheckAssetApprove.current();
    } finally {
      prevNumberOfPendingApprovals = numberOfPendingApprovals;
      setIsLoading(false);
    }
  }, [asset, cacheKey, contract, numberOfPendingApprovals, amount]);

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

      cacheKey.current = `${asset.symbol}-${contract || 'all'}`;
      setTimeout(() => checkApproved(), timeoutDuration);
    }
  }, [asset.symbol, checkApproved, contract, isWalletConnected, numberOfPendingApprovals, skip]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, asset, amount }: Params) => {
  const { wallet } = useWallet();
  const { numberOfPendingApprovals } = useTransactionsState();
  const walletAddress = useMemo(() => wallet?.[asset.L1Chain]?.address, [asset.L1Chain, wallet]);

  const possibleApprove = useMemo(
    () =>
      !isETHAsset(asset) &&
      !isAVAXAsset(asset) &&
      !isBSCAsset(asset) &&
      [Chain.Ethereum, Chain.Avalanche, Chain.BinanceSmartChain].includes(asset.L1Chain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset, contract],
  );

  const { isApproved, isLoading } = useApproveResult({
    isWalletConnected: !!walletAddress,
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : false,
    asset,
    contract: possibleApprove ? contract : undefined,
    amount,
  });

  return {
    isApproved,
    isWalletConnected: !!walletAddress,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};

export const useAssetApprovalCheck = () => {
  const { wallet } = useWallet();

  const handleApprove = useCallback(
    ({ asset, contract, amount }: { amount?: Amount; asset: AssetEntity; contract?: string }) =>
      wallet?.[asset.L1Chain]?.address
        ? checkAssetApprove({ asset, contract, amount })
        : Promise.resolve(false),
    [wallet],
  );

  return handleApprove;
};
