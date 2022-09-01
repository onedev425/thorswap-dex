import { Asset, hasConnectedWallet } from '@thorswap-lib/multichain-sdk';
import { useEffect, useMemo, useState } from 'react';
import { multichain } from 'services/multichain';
import { useMidgard } from 'store/midgard/hooks';
import { TxTrackerStatus } from 'store/midgard/types';
import { useWallet } from 'store/wallet/hooks';

export const useApprove = (asset: Asset, hasWallet = true) => {
  const { approveStatus } = useMidgard();
  const { wallet } = useWallet();
  const [isApproved, setApproved] = useState(hasWallet ? null : true);
  const [isLoading, setIsLoading] = useState(false);

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  useEffect(() => {
    if (!hasWallet || !isWalletConnected) {
      setApproved(true);
      return;
    }

    const checkApproved = async () => {
      if (approveStatus?.[asset.toString()] === TxTrackerStatus.Success) {
        setApproved(true);
      }
      setIsLoading(true);
      const approved = await multichain().isAssetApproved(asset);
      setIsLoading(false);
      setApproved(approved);
    };

    checkApproved();
  }, [asset, approveStatus, hasWallet, isWalletConnected]);

  const assetApproveStatus = useMemo(
    () => approveStatus?.[asset.toString()],
    [approveStatus, asset],
  );

  return { assetApproveStatus, isApproved, isLoading };
};
