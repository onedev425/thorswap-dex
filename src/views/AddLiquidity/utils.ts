import { Amount, Pool } from '@thorswap-lib/swapkit-core';
import { LiquidityTypeOption, PoolShareType } from 'store/midgard/types';

export const getMaxSymAmounts = ({
  assetAmount,
  runeAmount,
  pool,
  minAssetAmount,
  minRuneAmount,
}: {
  assetAmount: Amount;
  runeAmount: Amount;
  pool: Pool;
  minAssetAmount: Amount;
  minRuneAmount: Amount;
}) => {
  const symAssetAmount = runeAmount.mul(pool.runePriceInAsset);

  if (symAssetAmount.gt(assetAmount)) {
    const maxSymAssetAmount = assetAmount.lte(minAssetAmount) ? minAssetAmount : assetAmount;
    const maxSymRuneAmount = maxSymAssetAmount.mul(pool.assetPriceInRune).lte(minRuneAmount)
      ? minRuneAmount
      : maxSymAssetAmount.mul(pool.assetPriceInRune);

    return {
      maxSymAssetAmount,
      maxSymRuneAmount,
    };
  }
  const maxSymAssetAmount = symAssetAmount.lte(minAssetAmount) ? minAssetAmount : symAssetAmount;
  const maxSymRuneAmount = runeAmount.lte(minRuneAmount) ? minRuneAmount : runeAmount;

  return {
    maxSymAssetAmount,
    maxSymRuneAmount,
  };
};

export const liquidityToPoolShareType = (type: LiquidityTypeOption): PoolShareType => {
  if (type === LiquidityTypeOption.ASSET) return PoolShareType.ASSET_ASYM;
  if (type === LiquidityTypeOption.RUNE) return PoolShareType.RUNE_ASYM;
  return PoolShareType.SYM;
};
