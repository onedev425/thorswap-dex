import { AssetValue, Chain } from '@swapkit/core';
import { RUNEAsset } from 'helpers/assets';
import { useMemo } from 'react';
import { useMultisig } from 'store/multisig/hooks';
import { useMultissigAssets } from 'views/Multisig/hooks';

type Props = {
  poolAsset: AssetValue | undefined;
};

export const useDepositAssetsBalance = ({ poolAsset }: Props) => {
  const { isConnected, isWalletAssetConnected } = useMultisig();
  const { getAssetBalance, getMaxBalance } = useMultissigAssets();

  const poolAssetBalance = useMemo(() => {
    if (isConnected && poolAsset) {
      return getAssetBalance(poolAsset);
    }

    // TODO test allow max amount if wallet is not connected
    return poolAsset ? AssetValue.fromStringSync(poolAsset.toString(), 10 ** 3) : RUNEAsset;
  }, [isConnected, getAssetBalance, poolAsset]);

  const maxPoolAssetBalance = useMemo(
    () =>
      poolAsset
        ? getMaxBalance(poolAsset)
        : new AssetValue({ value: 0, decimal: 8, chain: Chain.THORChain, symbol: 'RUNE' }),
    [poolAsset, getMaxBalance],
  );

  const runeBalance = useMemo(() => {
    if (isConnected) {
      return getAssetBalance(RUNEAsset);
    }

    // allow max amount if wallet is not connected
    return AssetValue.fromChainOrSignature(Chain.THORChain, 10 ** 3);
  }, [getAssetBalance, isConnected]);

  const maxRuneBalance = useMemo(() => getMaxBalance(RUNEAsset), [getMaxBalance]);

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  };
};
