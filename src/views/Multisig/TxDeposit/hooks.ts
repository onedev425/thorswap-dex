import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { AddLiquidityParams, Asset, Memo } from '@thorswap-lib/multichain-sdk'

import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks'
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools'
import { useMultisigWallet } from 'views/Multisig/hooks'
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext'
import { useAssetsList } from 'views/Multisig/TxDeposit/useAssetsList'
import { useDepositAssetsBalance } from 'views/Multisig/TxDeposit/useDepositAssetsBalance'

import { useMultisig } from 'store/multisig/hooks'

import { useLiquidityType } from 'hooks/useLiquidityType'

import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants/router'

export const useTxDeposit = () => {
  const { signers } = useTxCreate()
  const { wallet } = useMultisigWallet()
  const assetRouteGetter = useCallback(
    (asset: Asset) => getMultisigTxCreateRoute(asset),
    [],
  )

  const { liquidityType, setLiquidityType } = useLiquidityType()
  const { poolAssets, pools, pool, poolAsset, handleSelectPoolAsset } =
    useAddLiquidityPools({ assetRouteGetter })
  const depositAssetsBalance = useDepositAssetsBalance({ poolAsset })

  const poolAssetList = useAssetsList({ poolAssets })
  const navigate = useNavigate()
  const { createDepositTx } = useMultisig()

  const onAddLiquidity = async ({
    runeAmount,
    runeAddr,
    pool,
  }: AddLiquidityParams) => {
    if (runeAmount?.gt(0)) {
      const tx = await createDepositTx(
        {
          memo: Memo.depositMemo(pool.asset, runeAddr),
          amount: runeAmount.amount,
          asset: runeAmount.asset,
        },
        signers,
      )

      if (tx) {
        navigate(ROUTES.TxMultisig, {
          state: { tx, signers },
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
    depositAssetsBalance,
    wallet,
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
