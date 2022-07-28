import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { AddLiquidityParams, Asset, Memo } from '@thorswap-lib/multichain-sdk'

import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks'
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools'
import { useAssetsList } from 'views/AddLiquidity/hooks/useAssetsList'

import { useMultisig } from 'store/multisig/hooks'

import { useLiquidityType } from 'hooks/useLiquidityType'

import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants/router'

export const useTxDeposit = () => {
  const assetRouteGetter = useCallback(
    (asset: Asset) => getMultisigTxCreateRoute(asset),
    [],
  )

  const { liquidityType, setLiquidityType } = useLiquidityType()
  const { poolAssets, pools, pool, poolAsset, handleSelectPoolAsset } =
    useAddLiquidityPools({ assetRouteGetter })

  //TODO: use multisig assets here
  const poolAssetList = useAssetsList({ liquidityType, poolAssets, pools })

  const navigate = useNavigate()
  const { createDepositTx } = useMultisig()

  const onAddLiquidity = async ({
    runeAmount,
    runeAddr,
    pool,
  }: AddLiquidityParams) => {
    if (runeAmount?.gt(0)) {
      const tx = await createDepositTx({
        memo: Memo.depositMemo(pool.asset, runeAddr),
        amount: runeAmount.amount,
        asset: runeAmount.asset,
      })

      if (tx) {
        navigate(ROUTES.TxMultisig, {
          state: { tx },
        })
      }
    }
  }

  const addLiquidity = useAddLiquidity({
    onAddLiquidity,
    skipWalletCheck: true,
    liquidityType,
    setLiquidityType,
    poolAsset,
    poolAssets,
    pools,
    pool,
  })

  return {
    handleSelectPoolAsset,
    poolAssetList,
    liquidityType,
    pool,
    poolAsset,
    ...addLiquidity,
  }
}
