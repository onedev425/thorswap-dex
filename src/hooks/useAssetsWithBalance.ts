import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { useBalance } from 'hooks/useBalance'

export const useAssetsWithBalance = (assets: Asset[]) => {
  const { getMaxBalance, isWalletAssetConnected } = useBalance()

  const assetsWithBalance = useMemo(
    () =>
      assets.map((asset: Asset) => ({
        asset,
        balance: isWalletAssetConnected(asset)
          ? getMaxBalance(asset)
          : undefined,
      })),
    [assets, getMaxBalance, isWalletAssetConnected],
  )

  return assetsWithBalance
}
