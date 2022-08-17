import { useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus, SubmitTx, TxTrackerType } from 'store/midgard/types'

import { multichain } from 'services/multichain'

/**
 * 1. send transaction and get txHash
 * 2. poll midgard action API and get "in" tx with the same txHash
 * 3. check action status (success, pending)
 * 4. check action type and match with send tx type
 *    (if action type is not "refund", action type should be matched to the send type)
 */

export const useTxTracker = () => {
  const {
    addNewTxTracker,
    updateTxTracker,
    clearTxTrackers,
    processSubmittedTx,
  } = useMidgard()

  // confirm and submit a transaction
  const submitTransaction = useCallback(
    ({
      type,
      submitTx,
    }: {
      type: TxTrackerType
      submitTx: SubmitTx
    }): string => {
      const uuid = uuidv4()

      addNewTxTracker({
        uuid,
        type,
        status: TxTrackerStatus.Submitting,
        submitTx,
        action: null,
        refunded: null,
      })

      return uuid
    },
    [addNewTxTracker],
  )

  const subscribeEthTx = useCallback(
    ({
      uuid,
      submitTx,
      txHash,
      callback,
    }: {
      uuid: string
      submitTx: SubmitTx
      txHash: string
      callback?: () => void
    }) => {
      const ethClient = multichain().eth.getClient()
      const ethProvider = ethClient.getProvider()

      if (txHash) {
        updateTxTracker({
          uuid,
          txTracker: {
            status: TxTrackerStatus.Pending,
            submitTx,
          },
        })
      }

      ethProvider.once(txHash, ({ status }) => {
        updateTxTracker({
          uuid,
          txTracker: {
            status: status ? TxTrackerStatus.Success : TxTrackerStatus.Failed,
            submitTx,
          },
        })

        if (status) {
          callback?.()
        }
      })
    },
    [updateTxTracker],
  )

  // start polling a transaction
  const pollTransaction = useCallback(
    ({
      uuid,
      submitTx,
      type,
    }: {
      uuid: string
      submitTx: SubmitTx
      type: TxTrackerType
    }) => {
      updateTxTracker({
        uuid,
        txTracker: {
          status:
            type === TxTrackerType.Send
              ? TxTrackerStatus.Success
              : TxTrackerStatus.Pending,
          submitTx,
        },
      })

      if (type !== TxTrackerType.Send) {
        processSubmittedTx({ submitTx, type })
      }
    },
    [updateTxTracker, processSubmittedTx],
  )

  const setTxFailed = useCallback(
    (uuid: string) => {
      updateTxTracker({ uuid, txTracker: { status: TxTrackerStatus.Failed } })
    },
    [updateTxTracker],
  )

  const setTxSuccess = useCallback(
    (uuid: string, submitTx?: SubmitTx) => {
      updateTxTracker({
        uuid,
        txTracker: { ...submitTx, status: TxTrackerStatus.Success },
      })
    },
    [updateTxTracker],
  )

  return {
    clearTxTrackers,
    pollTransaction,
    setTxFailed,
    setTxSuccess,
    submitTransaction,
    subscribeEthTx,
  }
}
