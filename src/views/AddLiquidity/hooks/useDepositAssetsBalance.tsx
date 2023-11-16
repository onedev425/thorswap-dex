import type { AssetValue } from '@swapkit/core';
import { BTCAsset, RUNEAsset } from 'helpers/assets';
import { getAssetBalance } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from 'store/wallet/hooks';
import { zeroAmount } from 'types/app';

type Props = {
  poolAsset: AssetValue | undefined;
};

export type DepositAssetsBalance = {
  isWalletAssetConnected: (asset: AssetValue) => boolean;
  poolAssetBalance?: AssetValue;
  maxPoolAssetBalance?: AssetValue;
  runeBalance: AssetValue;
  maxRuneBalance: AssetValue;
};

export const useDepositAssetsBalance = ({ poolAsset }: Props): DepositAssetsBalance => {
  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { wallet } = useWallet();

  const [maxPoolAssetBalance, setMaxPoolAssetBalance] = useState(poolAsset?.set(0));
  const [maxRuneBalance, setMaxRuneBalance] = useState(RUNEAsset.set(0));

  const poolAssetBalance = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset || BTCAsset, wallet);
    }

    // allow max amount if wallet is not connected
    return poolAsset?.set(10 ** 9);
  }, [poolAsset, wallet]);

  useEffect(() => {
    if (poolAsset)
      getMaxBalance(poolAsset).then((assetMaxBalance) => {
        setMaxPoolAssetBalance(assetMaxBalance || zeroAmount);
      });
  }, [poolAsset, getMaxBalance]);

  useEffect(() => {
    getMaxBalance(RUNEAsset).then((runeMaxBalance) =>
      setMaxRuneBalance(runeMaxBalance || zeroAmount),
    );
  }, [getMaxBalance]);

  const runeBalance = useMemo(() => {
    if (wallet) {
      return getAssetBalance(RUNEAsset, wallet);
    }

    // allow max amount if wallet is not connected
    return RUNEAsset.set(10 ** 9);
  }, [wallet]);

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  };
};
