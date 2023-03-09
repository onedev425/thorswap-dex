import { Amount, Pool } from '@thorswap-lib/swapkit-core';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { PoolShareType } from 'store/midgard/types';

export const getMaxSymAmounts = ({
  assetAmount,
  runeAmount,
  pool,
}: {
  assetAmount: Amount;
  runeAmount: Amount;
  pool: Pool;
}) => {
  const symAssetAmount = runeAmount.mul(pool.runePriceInAsset);

  if (symAssetAmount.gt(assetAmount)) {
    const maxSymAssetAmount = assetAmount;
    const maxSymRuneAmount = maxSymAssetAmount.mul(pool.assetPriceInRune);

    return {
      maxSymAssetAmount,
      maxSymRuneAmount,
    };
  }
  const maxSymAssetAmount = symAssetAmount;
  const maxSymRuneAmount = runeAmount;

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
