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
    }: {
      uuid: string
      submitTx: SubmitTx
      txHash: string
    }) => {
      const ethClient = multichain.eth.getClient()
      const ethProvider = ethClient.getProvider()

      ethProvider.once(txHash, (tx) => {
        const { status } = tx
        updateTxTracker({
          uuid,
          txTracker: {
            status: status ? TxTrackerStatus.Success : TxTrackerStatus.Failed,
            submitTx,
          },
        })
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
      if (type === TxTrackerType.Send) {
        updateTxTracker({
          uuid,
          txTracker: {
            status: TxTrackerStatus.Success,
            submitTx,
          },
        })
      } else {
        updateTxTracker({
          uuid,
          txTracker: {
            status: TxTrackerStatus.Pending,
            submitTx,
          },
        })
        processSubmittedTx({ submitTx, type })
      }
    },
    [updateTxTracker, processSubmittedTx],
  )

  // start polling a transaction
  const setTxFailed = useCallback(
    (uuid: string) => {
      updateTxTracker({
        uuid,
        txTracker: {
          status: TxTrackerStatus.Failed,
        },
      })
    },
    [updateTxTracker],
  )

  return {
    submitTransaction,
    pollTransaction,
    clearTxTrackers,
    setTxFailed,
    subscribeEthTx,
  }
}
