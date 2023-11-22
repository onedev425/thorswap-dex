import { type AssetValue, Chain } from '@swapkit/core';
import { useWallet } from 'context/wallet/hooks';
import { BTCAsset, RUNEAsset } from 'helpers/assets';
import { getAssetBalance } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useEffect, useMemo, useState } from 'react';
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

  const [poolAssetBalance, setMaxPoolAssetBalance] = useState(poolAsset?.set(0));
  const [runeBalance, setMaxRuneBalance] = useState(RUNEAsset.set(0));

  const maxPoolAssetBalance = useMemo(() => {
    //@ts-expect-error
    if (wallet[poolAsset?.chain || BTCAsset.chain]) {
      return getAssetBalance(poolAsset || BTCAsset, wallet);
    }
    // allow max amount if wallet is not connected
    return (poolAsset || BTCAsset).set(10 ** 9);
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

  const maxRuneBalance = useMemo(() => {
    if (wallet[Chain.THORChain]) {
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
