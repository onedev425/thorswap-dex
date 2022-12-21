import { Asset } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain, WalletOption } from '@thorswap-lib/types';
import { hasConnectedWallet, hasWalletConnected } from 'helpers/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { multichain } from 'services/multichain';
import { useAppSelector } from 'store/store';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';

type Params = {
  force?: boolean;
  asset: Asset;
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
  asset: Asset;
  contract?: string;
  hasWallet: boolean;
  skip: boolean;
}) => {
  const { wallet } = useWallet();
  const [isApproved, setApproved] = useState(hasWallet ? null : true);
  const [isLoading, setIsLoading] = useState(false);

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const checkApproved = useCallback(async () => {
    try {
      setIsLoading(true);

      const approved = await (contract
        ? multichain().isAssetApprovedForContract(asset, contract)
        : multichain().isAssetApproved(asset));
      setApproved(approved);
    } finally {
      setIsLoading(false);
    }
  }, [asset, contract]);

  useEffect(() => {
    if (skip || !hasWallet || !isWalletConnected) {
      setApproved(!skip);
    } else {
      checkApproved();
    }
  }, [numberOfPendingApprovals, asset, hasWallet, isWalletConnected, skip, checkApproved]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, asset }: Params) => {
  const { wallet, chainWalletLoading } = useWallet();
  const numberOfPendingApprovals = useAppSelector(
    ({ transactions }) =>
      transactions.pending.filter(({ type }) =>
        [TransactionType.ETH_APPROVAL, TransactionType.AVAX_APPROVAL].includes(type),
      ).length,
  );

  const isLedger = useMemo(() => {
    if (!wallet) return false;

    return wallet[asset.L1Chain as SupportedChain]?.walletType === WalletOption.LEDGER;
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
    hasWallet: !chainWalletLoading?.[asset?.L1Chain as SupportedChain] || isAssetWalletConnected,
  });

  return {
    isApproved,
    isWalletConnected: isAssetWalletConnected,
    isLoading: isLoading || numberOfPendingApprovals > 0,
  };
};
