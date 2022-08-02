import { useMemo } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import { DepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance'
import { useMultissigAssets } from 'views/Multisig/hooks'

import { useMultisig } from 'store/multisig/hooks'

type Props = {
  poolAsset: Asset
}

export const useDepositAssetsBalance = ({
  poolAsset,
}: Props): DepositAssetsBalance => {
  const { isConnected, isWalletAssetConnected } = useMultisig()
  const { getAssetBalance, getMaxBalance } = useMultissigAssets()

  const poolAssetBalance: Amount = useMemo(() => {
    if (isConnected) {
      return getAssetBalance(poolAsset).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [isConnected, getAssetBalance, poolAsset])

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  )

  const runeBalance: Amount = useMemo(() => {
    if (isConnected) {
      return getAssetBalance(Asset.RUNE()).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [getAssetBalance, isConnected])

  const maxRuneBalance: Amount = useMemo(
    () => getMaxBalance(Asset.RUNE()),
    [getMaxBalance],
  )

  return {
    isWalletAssetConnected,
    poolAssetBalance,
    maxPoolAssetBalance,
    runeBalance,
    maxRuneBalance,
  }
}
