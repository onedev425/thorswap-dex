import { useCallback } from 'react'

import {
  Asset,
  Amount,
  getNetworkFeeByAsset,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { useAppDispatch, useAppSelector } from 'store/store'
import * as walletActions from 'store/wallet/actions'

import { getGasRateByFeeOption } from 'helpers/networkFee'
import { getAssetBalance } from 'helpers/wallet'

export const useBalance = () => {
  const dispatch = useAppDispatch()
  const { feeOptionType, wallet, inboundGasRate } = useAppSelector(
    ({
      app: { feeOptionType },
      wallet: { wallet },
      midgard: { inboundGasRate },
    }) => ({ wallet, inboundGasRate, feeOptionType }),
  )

  const reloadBalanceByChain = useCallback(
    (chain: SupportedChain) => {
      dispatch(walletActions.getWalletByChain(chain))
    },
    [dispatch],
  )

  const reloadAllBalance = useCallback(() => {
    dispatch(walletActions.loadAllWallets())
  }, [dispatch])

  const isWalletAssetConnected = useCallback(
    (asset: Asset) => {
      return !!wallet?.[asset.L1Chain as SupportedChain]
    },
    [wallet],
  )

  const isWalletConnected = useCallback(
    (chain: SupportedChain) => !!wallet?.[chain],
    [wallet],
  )

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      if (!wallet?.[asset.L1Chain as SupportedChain]) {
        return Amount.fromAssetAmount(10 ** 8, asset.decimal)
      }

      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        gasRate: inboundGasRate[asset.L1Chain],
        feeOptionType,
      })
      const inboundFee = getNetworkFeeByAsset({
        asset,
        gasRate,
        direction: 'inbound',
      })

      const balance = getAssetBalance(asset, wallet).amount

      /**
       * if asset is used for gas, subtract the inbound gas fee from input amount
       * else allow full amount
       * Calc: max spendable amount = balance amount - 2 x gas fee(if send asset equals to gas asset)
       */
      const maxSpendableAmount = asset.isGasAsset()
        ? balance.sub(inboundFee.mul(1).amount)
        : balance

      return maxSpendableAmount.gt(0)
        ? maxSpendableAmount
        : Amount.fromAssetAmount(0, asset.decimal)
    },
    [wallet, inboundGasRate, feeOptionType],
  )

  return {
    isWalletAssetConnected,
    isWalletConnected,
    getMaxBalance,
    reloadAllBalance,
    reloadBalanceByChain,
    wallet,
  }
}
