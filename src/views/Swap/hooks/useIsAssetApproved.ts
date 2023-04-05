import { BigNumber } from '@ethersproject/bignumber';
import { Amount, AssetEntity, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fromWei } from 'services/contract';
import { useTransactionsState } from 'store/transactions/hooks';
import { useWallet } from 'store/wallet/hooks';

export const checkAssetApprove = async ({
  assetAmount,
  cacheKey,
  contract,
  asset,
}: {
  asset: AssetEntity;
  contract?: string;
  cacheKey: string;
  assetAmount: number;
}) => {
  if (
    cachedResults[cacheKey]?.isApproved &&
    cachedResults[cacheKey]?.approvedAmount - assetAmount > 0
  ) {
    return cachedResults[cacheKey];
  }

  const { isAssetApprovedForContract, isAssetApproved } = await (
    await import('services/swapKit')
  ).getSwapKitClient();

  const response = await (contract
    ? isAssetApprovedForContract(asset, contract)
    : isAssetApproved(asset));

  const approvedAmount =
    typeof response === 'boolean' ? 100000000 : fromWei(BigNumber.from(response));

  const isApproved = approvedAmount - assetAmount > 0;
  const approveResponse = { isApproved, approvedAmount };

  cachedResults[cacheKey] = approveResponse;
  return approveResponse;
};

let prevNumberOfPendingApprovals = 0;
let cachedResults: Record<string, { isApproved: boolean; approvedAmount: number }> = {};

const useApproveResult = ({
  isWalletConnected,
  numberOfPendingApprovals,
  asset,
  contract,
  skip,
  amount,
}: {
  isWalletConnected: boolean;
  numberOfPendingApprovals: number;
  asset: AssetEntity;
  contract?: string;
  skip: boolean;
  amount?: Amount;
}) => {
  const [{ isApproved, approvedAmount }, setApproved] = useState({
    approvedAmount: 0,
    isApproved: isGasAsset(asset) || !isWalletConnected,
  });
  const [isLoading, setIsLoading] = useState(false);
  const cacheKey = useMemo(() => `${asset.symbol}-${contract || 'all'}`, [asset.symbol, contract]);
  const assetAmount = useMemo(() => parseFloat(amount?.toSignificant(6) || '0'), [amount]);

  const debouncedCheckAssetApprove = useRef(
    debounce(checkAssetApprove, 1000, { leading: true, trailing: false }),
  );

  const checkApproved = useCallback(async () => {
    try {
      const approveResponse = await debouncedCheckAssetApprove.current({
        cacheKey,
        asset,
        contract,
        assetAmount,
      });

      setApproved(approveResponse);
    } finally {
      prevNumberOfPendingApprovals = numberOfPendingApprovals;
      setIsLoading(false);
    }
  }, [asset, assetAmount, cacheKey, contract, numberOfPendingApprovals]);

  useEffect(() => {
    if (skip || !isWalletConnected) {
      setApproved({ isApproved: !skip, approvedAmount: 0 });
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

  return { isApproved, approvedAmount, isLoading };
};

export const useIsAssetApproved = ({
  force,
  contract,
  asset,
  amount,
}: {
  force?: boolean;
  asset: AssetEntity;
  contract?: string;
  amount?: Amount;
}) => {
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

  const { isApproved, approvedAmount, isLoading } = useApproveResult({
    isWalletConnected: !!walletAddress,
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : false,
    asset,
    contract: possibleApprove ? contract : undefined,
    amount,
  });

  return {
    isApproved,
    approvedAmount,
    isWalletConnected: !!walletAddress,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};

export const useAssetApprovalCheck = () => {
  const { wallet } = useWallet();

  const handleApprove = useCallback(
    ({ asset, contract }: { asset: AssetEntity; contract?: string }) =>
      wallet?.[asset.L1Chain]?.address
        ? checkAssetApprove({
            asset,
            contract,
            cacheKey: `${asset.symbol}-${contract || 'all'}`,
            assetAmount: 0,
          })
        : Promise.resolve({ isApproved: false, approvedAmount: 0 }),
    [wallet],
  );

  return handleApprove;
};
