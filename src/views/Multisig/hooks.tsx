import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Amount,
  Asset,
  AssetAmount,
  NetworkFee,
} from '@thorswap-lib/multichain-sdk'

import { Button, Icon } from 'components/Atomic'

import { useMultisig } from 'store/multisig/hooks'
import { useAppSelector } from 'store/store'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { t } from 'services/i18n'
import { multisig } from 'services/multisig'

import { formatPrice } from 'helpers/formatPrice'
import { getGasRateByFeeOption } from 'helpers/networkFee'

export const useMultisigWalletInfo = () => {
  const { runeBalance, loadingBalances } = useMultissigAssets()
  const { address, treshold } = useAppSelector((state) => state.multisig)

  const { shortAddress, handleCopyAddress } = useAddressUtils(address)
  const formattedRune = `${formatPrice(runeBalance?.amount || 0, {
    prefix: '',
  })} ${Asset.RUNE().ticker}`

  const runeValue = useMemo(() => {
    if (runeBalance) {
      return formattedRune
    }

    return loadingBalances ? <Icon name="refresh" spin size={16} /> : '-'
  }, [formattedRune, loadingBalances, runeBalance])

  const info = [
    {
      label: t('views.multisig.safeAddress'),
      value: (
        <Button
          className="!px-2 h-[30px]"
          type="borderless"
          variant="tint"
          endIcon={<Icon size={14} name="copy" />}
          tooltip={t('common.copy')}
          onClick={(e) => {
            handleCopyAddress()
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          {shortAddress}
        </Button>
      ),
    },
    {
      label: t('views.wallet.totalBalance'),
      value: runeValue,
    },
    { label: t('views.multisig.threshold'), value: treshold },
  ]

  return info
}

export const useMultissigAssets = () => {
  const { loadBalances } = useMultisig()
  const [runeBalance, setRuneBalance] = useState<AssetAmount | null>(null)
  const { balances, loadingBalances } = useAppSelector(
    (state) => state.multisig,
  )
  const { feeOptionType, inboundData } = useAppSelector(
    ({
      app: { feeOptionType },
      wallet: { wallet },
      midgard: { inboundData },
    }) => ({ wallet, inboundData, feeOptionType }),
  )

  useEffect(() => {
    loadBalances()
  }, [loadBalances])

  useEffect(() => {
    const balance = multisig.getAssetBalance(Asset.RUNE(), balances)
    setRuneBalance(balance)
  }, [balances])

  const assetsWithBalance = balances.map((a) => ({
    asset: a.asset,
    balance: a.amount,
  }))

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        inboundData,
        chain: asset.L1Chain,
        feeOptionType,
      })
      const inboundFee = NetworkFee.getNetworkFeeByAsset({
        asset,
        gasRate,
        direction: 'inbound',
      })

      const balance = multisig.getAssetBalance(asset, balances).amount

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
    [balances, feeOptionType, inboundData],
  )

  return { loadingBalances, runeBalance, assetsWithBalance, getMaxBalance }
}
