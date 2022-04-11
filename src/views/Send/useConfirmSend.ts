import { useCallback } from 'react'

import { Amount, Asset, AssetAmount } from '@thorswap-lib/multichain-sdk'

import { showToast, ToastType } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'

import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
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

        console.info('txURL', txURL)
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
      } catch (error: any) {
        console.info('error', error)
        setTxFailed(trackId)

        // TODO: better error translation
        // const description = translateErrorMsg(error?.toString())
        showToast(
          {
            message: t('notification.sendTxFailed'),
            description: error?.toString(),
          },
          ToastType.Error,
          { duration: 20 * 1000 },
        )
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
