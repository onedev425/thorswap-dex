import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { RUNEAsset } from 'helpers/assets';
import { getAssetBalance } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useMemo } from 'react';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  poolAsset: Asset;
};

export type DepositAssetsBalance = {
  isWalletAssetConnected: (asset: Asset) => boolean;
  poolAssetBalance: Amount;
  maxPoolAssetBalance: Amount;
  runeBalance: Amount;
  maxRuneBalance: Amount;
};

export const useDepositAssetsBalance = ({ poolAsset }: Props): DepositAssetsBalance => {
  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { wallet } = useWallet();

  const poolAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset, wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [poolAsset, wallet]);

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  );

  const runeBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(RUNEAsset, wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [wallet]);

  const maxRuneBalance: Amount = useMemo(() => getMaxBalance(RUNEAsset), [getMaxBalance]);

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  };
};
