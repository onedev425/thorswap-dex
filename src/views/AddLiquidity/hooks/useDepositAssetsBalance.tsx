import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { RUNEAsset } from 'helpers/assets';
import { getAssetBalance } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from 'store/wallet/hooks';
import { zeroAmount } from 'types/app';

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

  const [maxPoolAssetBalance, setMaxPoolAssetBalance] = useState(zeroAmount);

  const [maxRuneBalance, setMaxRuneBalance] = useState(zeroAmount);

  const poolAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset, wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [poolAsset, wallet]);

  useEffect(() => {
    getMaxBalance(poolAsset).then((assetMaxBalance) =>
      setMaxPoolAssetBalance(assetMaxBalance || zeroAmount),
    );
  }, [poolAsset, getMaxBalance]);

  useEffect(() => {
    getMaxBalance(RUNEAsset).then((runeMaxBalance) =>
      setMaxRuneBalance(runeMaxBalance || zeroAmount),
    );
  }, [getMaxBalance]);

  const runeBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(RUNEAsset, wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [wallet]);

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  };
};
