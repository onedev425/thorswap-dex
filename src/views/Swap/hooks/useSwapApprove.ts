import { useCallback } from 'react'

import { Asset, QuoteMode } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import { v4 } from 'uuid'

import { showErrorToast } from 'components/Toast'

import { useAppDispatch } from 'store/store'
import {
  addTransaction,
  completeTransaction,
  updateTransaction,
} from 'store/transactions/slice'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

type Params = {
  inputAsset: Asset
  quoteMode: QuoteMode
  contract: string
}

export const useSwapApprove = ({ inputAsset, contract, quoteMode }: Params) => {
  const appDispatch = useAppDispatch()
  const { wallet } = useWallet()

  const handleApprove = useCallback(async () => {
    const from = wallet?.[inputAsset.L1Chain as SupportedChain]?.address
    if (from) {
      const id = v4()

      appDispatch(
        addTransaction({
          id,
          from,
          label: `${t('txManager.approve')} ${inputAsset.name}`,
          inChain: inputAsset.L1Chain,
          type: 'approve',
          quoteMode,
        }),
      )

      try {
        const txid = await ([
          QuoteMode.ETH_TO_TC_SUPPORTED,
          QuoteMode.ETH_TO_ETH,
        ].includes(quoteMode)
          ? multichain().approveAssetForStaking(inputAsset, contract)
          : multichain().approveAsset(inputAsset))

        if (txid) {
          appDispatch(updateTransaction({ id, txid }))
        }
      } catch (error) {
        console.error(error)
        appDispatch(completeTransaction({ id, status: 'error' }))
        showErrorToast(t('notification.approveFailed'))
      }
    }
  }, [wallet, inputAsset, appDispatch, quoteMode, contract])

  return handleApprove
}
