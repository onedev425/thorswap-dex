import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain, WalletOption } from '@thorswap-lib/types';
import { hasConnectedWallet, hasWalletConnected } from 'helpers/wallet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTransactionsState } from 'store/transactions/hooks';
import { useWallet } from 'store/wallet/hooks';

type Params = {
  force?: boolean;
  asset: AssetEntity;
  contract?: string;
};

const useApproveResult = ({
  numberOfPendingApprovals,
  asset,
  contract,
  hasWallet,
  skip,
}: {
  numberOfPendingApprovals: number;
  asset: AssetEntity;
  contract?: string;
  hasWallet: boolean;
  skip: boolean;
}) => {
  const prevNumberOfPendingApprovals = useRef(0);

  const { wallet } = useWallet();
  const [isApproved, setApproved] = useState(hasWallet ? null : true);
  const [isLoading, setIsLoading] = useState(false);

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const checkApproved = useCallback(async () => {
    try {
      const { isAssetApprovedForContract, isAssetApproved } = await (
        await import('services/multichain')
      ).getSwapKitClient();

      const approved = await (contract
        ? isAssetApprovedForContract(asset, contract)
        : isAssetApproved(asset));

      setApproved(!!approved);
    } finally {
      prevNumberOfPendingApprovals.current = numberOfPendingApprovals;
      setIsLoading(false);
    }
  }, [asset, contract, numberOfPendingApprovals]);

  useEffect(() => {
    if (skip || !hasWallet || !isWalletConnected) {
      setApproved(!skip);
    } else {
      setIsLoading(true);
      /**
       * Place a timeout to avoid the case where the user approves the asset
       * and rpc returns the old state. This will cause the UI to show the
       * approve button again.
       */
      const timeoutDuration =
        prevNumberOfPendingApprovals.current > numberOfPendingApprovals ? 15000 : 0;

      setTimeout(() => checkApproved(), timeoutDuration);
    }
  }, [numberOfPendingApprovals, asset, hasWallet, isWalletConnected, skip, checkApproved]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, asset }: Params) => {
  const { wallet, chainWalletLoading } = useWallet();
  const { numberOfPendingApprovals } = useTransactionsState();

  const isLedger = useMemo(() => {
    if (!wallet) return false;

    return wallet[asset.L1Chain as Chain]?.walletType === WalletOption.LEDGER;
  }, [asset.L1Chain, wallet]);

  const isAssetWalletConnected = useMemo(
    () => asset && hasWalletConnected({ wallet, inputAssets: [asset] }),
    [asset, wallet],
  );

  const possibleApprove = useMemo(
    () =>
      !asset.isETH() &&
      !asset.isAVAX() &&
      [Chain.Ethereum, Chain.Avalanche].includes(asset.L1Chain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset, contract],
  );

  const { isApproved, isLoading } = useApproveResult({
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : isLedger,
    asset,
    contract: possibleApprove ? contract : undefined,
    hasWallet: !chainWalletLoading?.[asset?.L1Chain as Chain] || isAssetWalletConnected,
  });

  return {
    isApproved,
    isWalletConnected: isAssetWalletConnected,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};
