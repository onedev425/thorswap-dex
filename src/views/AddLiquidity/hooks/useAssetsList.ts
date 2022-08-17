import { useMemo } from 'react'

import { Asset, hasConnectedWallet, Pool } from '@thorswap-lib/multichain-sdk'

import { LiquidityTypeOption } from 'components/LiquidityType/types'

import { useWallet } from 'store/wallet/hooks'

import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance'

import { getInputAssetsForAdd } from 'helpers/wallet'

type Props = {
  poolAssets: Asset[]
  pools: Pool[]
  liquidityType: LiquidityTypeOption
}

export const useAssetsList = ({ liquidityType, pools, poolAssets }: Props) => {
  const { wallet } = useWallet()

  const inputAssets = useMemo(() => {
    if (
      hasConnectedWallet(wallet) &&
      liquidityType !== LiquidityTypeOption.RUNE
    ) {
      return getInputAssetsForAdd({ wallet, pools })
    }

    return poolAssets
  }, [wallet, pools, poolAssets, liquidityType])

  const poolAssetList = useAssetsWithBalance(inputAssets)

  return poolAssetList
}
