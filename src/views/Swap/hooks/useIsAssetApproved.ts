import {
  Asset,
  hasConnectedWallet,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-core';
import { SupportedChain, WalletOption } from '@thorswap-lib/types';
import { TS_AGGREGATOR_PROXY_ADDRESS } from 'config/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { multichain } from 'services/multichain';
import { useAppSelector } from 'store/store';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';

type Params = {
  force?: boolean;
  asset: Asset;
  quoteMode?: QuoteMode;
  contract?: string;
};

const useApproveResult = ({
  numberOfPendingApprovals,
  asset,
  contractAddress,
  hasWallet,
  skip,
}: {
  numberOfPendingApprovals: number;
  asset: Asset;
  contractAddress?: string;
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

      const approved = await (contractAddress
        ? multichain().isAssetApprovedForContract(asset, contractAddress)
        : multichain().isAssetApproved(asset));
      setApproved(approved);
    } finally {
      setIsLoading(false);
    }
  }, [asset, contractAddress]);

  useEffect(() => {
    if (skip || !hasWallet || !isWalletConnected) {
      setApproved(!skip);
    } else {
      checkApproved();
    }
  }, [
    numberOfPendingApprovals,
    asset,
    hasWallet,
    isWalletConnected,
    contractAddress,
    skip,
    checkApproved,
  ]);

  return { isApproved, isLoading };
};

export const useIsAssetApproved = ({ force, contract, asset, quoteMode }: Params) => {
  const { wallet, chainWalletLoading } = useWallet();
  const numberOfPendingApprovals = useAppSelector(
    ({ transactions }) =>
      transactions.pending.filter(({ type }) => type === TransactionType.ETH_APPROVAL).length,
  );

  const isLedger = useMemo(() => {
    if (!wallet) return false;

    return wallet[asset.L1Chain as SupportedChain]?.walletType === WalletOption.LEDGER;
  }, [asset.L1Chain, wallet]);

  const isAssetWalletConnected = useMemo(
    () => asset && hasWalletConnected({ wallet, inputAssets: [asset] }),
    [asset, wallet],
  );

  const { isApproved, isLoading } = useApproveResult({
    numberOfPendingApprovals,
    skip: typeof force === 'boolean' ? !force : isLedger,
    asset,
    contractAddress:
      quoteMode && [QuoteMode.ETH_TO_TC_SUPPORTED, QuoteMode.ETH_TO_ETH].includes(quoteMode)
        ? quoteMode === QuoteMode.ETH_TO_TC_SUPPORTED
          ? TS_AGGREGATOR_PROXY_ADDRESS
          : contract
        : undefined,
    hasWallet: !chainWalletLoading?.[asset?.L1Chain as SupportedChain] || isAssetWalletConnected,
  });

  return { isApproved, isLoading: isLoading || numberOfPendingApprovals > 0 };
};
