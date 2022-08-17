import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { Asset, AssetAmount } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext'
import { BondActionType, HandleBondAction } from 'views/Nodes/types'

import { useMultisig } from 'store/multisig/hooks'

import { ROUTES } from 'settings/constants'

import { getBondMemo } from './utils'

export const useTxBond = () => {
  const { signers } = useTxCreate()
  const navigate = useNavigate()

  const { createDepositTx } = useMultisig()

  const handleBondAction: HandleBondAction = useCallback(
    async ({ amount, nodeAddress, type }) => {
      if (
        (type === BondActionType.Bond || type === BondActionType.Unbond) &&
        !amount
      ) {
        throw new Error('Amount not provided')
      }

      const memo = getBondMemo(type, nodeAddress, amount)

      const tx = await createDepositTx(
        {
          memo,
          amount:
            type === BondActionType.Bond && amount
              ? amount
              : AssetAmount.getMinAmountByChain(Chain.THORChain).amount,
          asset: Asset.RUNE(),
        },
        signers,
      )

      if (tx) {
        navigate(ROUTES.TxMultisig, {
          state: { tx, signers },
        })
      }
    },
    [createDepositTx, signers, navigate],
  )

  return handleBondAction
}
