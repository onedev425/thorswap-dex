import { useCallback } from 'react'

import { Amount, Asset, AssetAmount } from '@thorswap-lib/multichain-sdk'

import { TxTrackerType } from 'redux/midgard/types'

import { useTxTracker } from 'hooks/useTxTracker'

import { multichain } from 'services/multichain'

type Params = {
  sendAsset: Asset
  sendAmount: Amount
  recipientAddress: string
  memo: string
  setIsOpenConfirmModal: (isOpen: boolean) => void
}

export const useConfirmSend = ({
  sendAsset,
  sendAmount,
  recipientAddress,
  memo,
  setIsOpenConfirmModal,
}: Params) => {
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()

  const handleConfirmSend = useCallback(async () => {
    setIsOpenConfirmModal(false)

    if (sendAsset) {
      const assetAmount = new AssetAmount(sendAsset, sendAmount)

      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Send,
        submitTx: {
          inAssets: [
            {
              asset: sendAsset.toString(),
              amount: sendAmount.toSignificant(6),
            },
          ],
        },
      })

      try {
        const txHash = await multichain.send({
          assetAmount,
          recipient: recipientAddress,
          memo,
        })

        const txURL = multichain.getExplorerTxUrl(sendAsset.L1Chain, txHash)

        console.log('txURL', txURL)
        if (txHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Send,
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: sendAsset.toString(),
                  amount: sendAmount.toSignificant(6),
                },
              ],
              txID: txHash,
            },
          })
        }
      } catch (error) {
        console.log('error', error)
        setTxFailed(trackId)

        // TODO: notification
        // Notification({
        //   type: 'error',
        //   message: 'Send Transaction Failed.',
        //   description: error?.toString(),
        //   duration: 20,
        // })
      }
    }
  }, [
    setIsOpenConfirmModal,
    sendAsset,
    sendAmount,
    submitTransaction,
    recipientAddress,
    memo,
    pollTransaction,
    setTxFailed,
  ])

  return handleConfirmSend
}
