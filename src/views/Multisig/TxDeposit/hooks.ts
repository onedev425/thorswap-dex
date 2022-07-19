import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { AddLiquidityParams, Asset, Memo } from '@thorswap-lib/multichain-sdk'

import { useAddLiquidity } from 'views/AddLiquidity/hooks'

import { useMultisig } from 'store/multisig/hooks'

import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants/router'

export const useTxDeposit = () => {
  const navigate = useNavigate()
  const { createDepositTx } = useMultisig()
  const assetRouteGetter = useCallback(
    (asset: Asset) => getMultisigTxCreateRoute(asset),
    [],
  )

  const onAddLiquidity = async ({
    runeAmount,
    runeAddr,
  }: AddLiquidityParams) => {
    if (runeAmount?.gt(0)) {
      const tx = await createDepositTx({
        memo: Memo.depositMemo(runeAmount.asset, runeAddr),
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
    assetRouteGetter,
    onAddLiquidity,
    skipWalletCheck: true,
  })

  return addLiquidity
}
