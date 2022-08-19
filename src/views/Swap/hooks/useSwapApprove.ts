import { useCallback, useMemo } from 'react'

import {
  Asset,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'
import { v4 } from 'uuid'

import { showErrorToast } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'
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

type Params = {
  inputAsset: Asset
  quoteMode: QuoteMode
  contract: string
}

export const useSwapApprove = ({ inputAsset, contract, quoteMode }: Params) => {
  const appDispatch = useAppDispatch()
  const { wallet } = useWallet()
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()
  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const handleApprove = useCallback(async () => {
    if (isInputWalletConnected) {
      const id = v4()
      const submitTx = {
        // not needed for approve tx
        quoteMode,
        contract,
        inAssets: [{ asset: inputAsset.toString(), amount: '0' }],
      }
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx,
      })

      appDispatch(
        addTransaction({
          id,
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

          // start polling
          pollTransaction({
            type: TxTrackerType.Approve,
            uuid: trackId,
            submitTx: { ...submitTx, txID: txid },
          })
        }
      } catch (error) {
        console.error(error)
        setTxFailed(trackId)
        appDispatch(completeTransaction({ id, status: 'error' }))
        showErrorToast(t('notification.approveFailed'))
      }
    }
  }, [
    isInputWalletConnected,
    quoteMode,
    contract,
    inputAsset,
    submitTransaction,
    appDispatch,
    pollTransaction,
    setTxFailed,
  ])

  return handleApprove
}
