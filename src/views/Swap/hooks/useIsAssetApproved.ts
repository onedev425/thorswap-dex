import { baseAmount } from '@thorswap-lib/helpers';
import { Amount, AssetEntity, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
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

  return await (contract
    ? isAssetApprovedForContract(
        asset,
        contract,
        amount ? baseAmount(Math.ceil(amount.assetAmount.toNumber() || 0)) : undefined,
      )
    : isAssetApproved(asset));
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
      const isApproved = (await debouncedCheckAssetApprove.current({
        amount,
        asset,
        contract,
      })) as boolean;
      setApproved(isApproved);
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
      !isETHAsset(asset) &&
      !isAVAXAsset(asset) &&
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
