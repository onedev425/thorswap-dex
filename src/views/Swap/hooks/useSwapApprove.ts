import { useCallback, useMemo } from 'react'

import {
  Asset,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'

import { showErrorToast } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'
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
  const { wallet } = useWallet()
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()
  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const handleApprove = useCallback(async () => {
    if (isInputWalletConnected) {
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

      try {
        const txID = await ([
          QuoteMode.ETH_TO_TC_SUPPORTED,
          QuoteMode.ETH_TO_ETH,
        ].includes(quoteMode)
          ? multichain().approveAssetForStaking(inputAsset, contract)
          : multichain().approveAsset(inputAsset))

        if (txID) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Approve,
            uuid: trackId,
            submitTx: { ...submitTx, txID },
          })
        }
      } catch (error) {
        console.error(error)
        setTxFailed(trackId)
        showErrorToast(t('notification.approveFailed'))
      }
    }
  }, [
    inputAsset,
    contract,
    isInputWalletConnected,
    quoteMode,
    pollTransaction,
    setTxFailed,
    submitTransaction,
  ])

  return handleApprove
}
