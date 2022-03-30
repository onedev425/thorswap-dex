import { Amount, Pool } from '@thorswap-lib/multichain-sdk'

export const getMaxSymAmounts = ({
  assetAmount,
  runeAmount,
  pool,
}: {
  assetAmount: Amount
  runeAmount: Amount
  pool: Pool
}) => {
  const symAssetAmount = runeAmount.mul(pool.runePriceInAsset)

  if (symAssetAmount.gt(assetAmount)) {
    const maxSymAssetAmount = assetAmount
    const maxSymRuneAmount = maxSymAssetAmount.mul(pool.assetPriceInRune)

    return {
      maxSymAssetAmount,
      maxSymRuneAmount,
    }
  }
  const maxSymAssetAmount = symAssetAmount
  const maxSymRuneAmount = runeAmount

  return {
    maxSymAssetAmount,
    maxSymRuneAmount,
  }
}
