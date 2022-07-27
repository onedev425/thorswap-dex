import { useCallback } from 'react'

import {
  Asset,
  Amount,
  getAssetBalance,
  getNetworkFeeByAsset,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { useAppDispatch, useAppSelector } from 'store/store'
import * as walletActions from 'store/wallet/actions'

import { getGasRateByFeeOption } from 'helpers/networkFee'

export const useBalance = () => {
  const dispatch = useAppDispatch()
  const { feeOptionType, wallet, inboundData } = useAppSelector(
    ({
      app: { feeOptionType },
      wallet: { wallet },
      midgard: { inboundData },
    }) => ({ wallet, inboundData, feeOptionType }),
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

  const getMaxBalance = useCallback(
    (asset: Asset, virtualBalance = true): Amount => {
      if (!wallet?.[asset.L1Chain as SupportedChain]) {
        // allow max amount for emulation if wallet is not connected

        if (virtualBalance) {
          return Amount.fromAssetAmount(10 ** 8, 8)
        }

        return Amount.fromAssetAmount(0, 8)
      }

      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        inboundData,
        chain: asset.L1Chain,
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

      if (maxSpendableAmount.gt(0)) {
        return maxSpendableAmount
      }

      return Amount.fromAssetAmount(0, asset.decimal)
    },
    [wallet, feeOptionType, inboundData],
  )

  return {
    isWalletAssetConnected,
    getMaxBalance,
    reloadAllBalance,
    reloadBalanceByChain,
    wallet,
  }
}
