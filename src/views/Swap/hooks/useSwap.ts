import { useCallback } from 'react'

import {
  Asset,
  Amount,
  QuoteMode,
  QuoteRoute,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain, FeeOption } from '@thorswap-lib/types'

import { getSwapTrackerType, getTxAsset } from 'views/Swap/helpers'

import { showErrorToast } from 'components/Toast'

import { useApp } from 'store/app/hooks'
import { useAppDispatch } from 'store/store'
import {
  addTransaction,
  completeTransaction,
  updateTransaction,
} from 'store/transactions/slice'
import { useWallet } from 'store/wallet/hooks'

import { useTxTracker } from 'hooks/useTxTracker'

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
  contract: string
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
  contract,
}: SwapParams) => {
  const appDispatch = useAppDispatch()
  const { feeOptionType } = useApp()
  const { wallet } = useWallet()
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()

  const handleSwap = useCallback(async () => {
    let uuid = ''

    try {
      if (wallet && route) {
        if (!wallet?.[inputAsset.L1Chain as SupportedChain]?.address) {
          throw new Error('No address found')
        }

        const trackerType = getSwapTrackerType({ inputAsset, outputAsset })

        const submitTx = {
          quoteMode,
          contract,
          inAssets: [getTxAsset(inputAsset, inputAmount)],
          outAssets: [getTxAsset(outputAsset, outputAmount)],
        }

        uuid = submitTransaction({ type: trackerType, submitTx })

        appDispatch(
          addTransaction({ id: uuid, chain: inputAsset.L1Chain, quoteMode }),
        )

        const txid = await multichain().swapThroughAggregator({
          route,
          recipient,
          quoteMode,
          feeOptionKey: feeOptionType,
        })

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id: uuid, txid }))

          pollTransaction({
            uuid,
            type: trackerType,
            submitTx: { ...submitTx, txID: txid },
          })
        } else {
          setTxFailed(uuid)
          appDispatch(completeTransaction({ id: uuid, status: 'fail' }))
          showErrorToast(t('notification.submitTxFailed'), JSON.stringify(txid))
          if (typeof txid === 'object') console.error(txid)
        }
      }
    } catch (error: NotWorth) {
      if (uuid) setTxFailed(uuid)
      const description = translateErrorMsg(error?.toString())
      console.error(error, description)
      showErrorToast(t('notification.submitTxFailed'), description || '')
    }
  }, [
    wallet,
    route,
    inputAsset,
    outputAsset,
    quoteMode,
    contract,
    inputAmount,
    outputAmount,
    submitTransaction,
    recipient,
    feeOptionType,
    appDispatch,
    pollTransaction,
    setTxFailed,
  ])

  return handleSwap
}
