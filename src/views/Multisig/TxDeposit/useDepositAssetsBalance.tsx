import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { RUNEAsset } from 'helpers/assets';
import { useMemo } from 'react';
import { useMultisig } from 'store/multisig/hooks';
import type { DepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';
import { useMultissigAssets } from 'views/Multisig/hooks';

type Props = {
  poolAsset: Asset;
};

export const useDepositAssetsBalance = ({ poolAsset }: Props): DepositAssetsBalance => {
  const { isConnected, isWalletAssetConnected } = useMultisig();
  const { getAssetBalance, getMaxBalance } = useMultissigAssets();

  const poolAssetBalance: Amount = useMemo(() => {
    if (isConnected) {
      return getAssetBalance(poolAsset).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [isConnected, getAssetBalance, poolAsset]);

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  );

  const runeBalance: Amount = useMemo(() => {
    if (isConnected) {
      return getAssetBalance(RUNEAsset).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [getAssetBalance, isConnected]);

  const maxRuneBalance: Amount = useMemo(() => getMaxBalance(RUNEAsset), [getMaxBalance]);

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  };
};
