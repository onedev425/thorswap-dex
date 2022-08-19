import { useCallback } from 'react'

import {
  Asset,
  Amount,
  QuoteMode,
  QuoteRoute,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain, FeeOption } from '@thorswap-lib/types'
import { v4 } from 'uuid'

import { showErrorToast } from 'components/Toast'

import { useApp } from 'store/app/hooks'
import { useAppDispatch } from 'store/store'
import {
  addTransaction,
  completeTransaction,
  updateTransaction,
} from 'store/transactions/slice'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { translateErrorMsg } from 'helpers/error'

type SwapParams = {
  route?: QuoteRoute
  quoteMode: QuoteMode
  recipient: string
  inputAsset: Asset
  inputAmount: Amount
  outputAsset: Asset
  outputAmount: Amount
}

export const gasFeeMultiplier: Record<FeeOption, number> = {
  average: 1.2,
  fast: 1.6,
  fastest: 2,
}

export const useSwap = ({
  recipient,
  inputAsset,
  inputAmount,
  outputAsset,
  outputAmount,
  route,
  quoteMode,
}: SwapParams) => {
  const appDispatch = useAppDispatch()
  const { feeOptionType } = useApp()
  const { wallet } = useWallet()

  const handleSwap = useCallback(async () => {
    const id = v4()

    try {
      if (wallet && route) {
        const from = wallet?.[inputAsset.L1Chain as SupportedChain]?.address
        if (!from) throw new Error('No address found')

        const label = `${inputAmount.toSignificant(6)} ${
          inputAsset.name
        } → ${outputAmount.toSignificant(6)} ${outputAsset.name.toString()}`
        appDispatch(
          addTransaction({
            id,
            label,
            from,
            outChain: outputAsset.L1Chain,
            inChain: inputAsset.L1Chain,
            quoteMode,
          }),
        )

        const txid = await multichain().swapThroughAggregator({
          route,
          recipient,
          quoteMode,
          feeOptionKey: feeOptionType,
        })

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }))
        } else {
          appDispatch(completeTransaction({ id, status: 'error' }))
          showErrorToast(t('notification.submitTxFailed'), JSON.stringify(txid))
          if (typeof txid === 'object') console.info(txid)
        }
      }
    } catch (error: NotWorth) {
      const description = translateErrorMsg(error?.toString())
      appDispatch(completeTransaction({ id, status: 'error' }))

      console.info(error, description)
      showErrorToast(t('notification.submitTxFailed'), description || '')
    }
  }, [
    wallet,
    route,
    inputAsset,
    outputAsset,
    quoteMode,
    inputAmount,
    outputAmount,
    recipient,
    feeOptionType,
    appDispatch,
  ])

  return handleSwap
}
