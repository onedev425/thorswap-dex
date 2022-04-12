import { ActionTypeEnum, Transaction } from '@thorswap-lib/midgard-sdk'
import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import { TxProgressStatus } from 'components/TxManager/types'

import { TxTracker, TxTrackerStatus, TxTrackerType } from 'store/midgard/types'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

export type Pair = {
  sendAsset: string
  receiveAsset: string
}

export const isSwapType = (txTracker: TxTracker): boolean => {
  if (
    txTracker.type === TxTrackerType.Swap ||
    txTracker.type === TxTrackerType.Mint ||
    txTracker.type === TxTrackerType.Redeem
  ) {
    return true
  }

  return false
}

export const getSwapSendTitle = ({ sendAsset, receiveAsset }: Pair) => {
  if (
    Asset.fromAssetString(sendAsset)?.isSynth &&
    Asset.fromAssetString(receiveAsset)?.isSynth === false
  )
    return t('txManager.burn')
  return t('txManager.send')
}

export const getSwapReceiveTitle = ({
  sendAsset,
  receiveAsset,
}: {
  sendAsset: string
  receiveAsset: string
}) => {
  if (
    Asset.fromAssetString(sendAsset)?.isSynth === false &&
    Asset.fromAssetString(receiveAsset)?.isSynth
  )
    return t('txManager.mint')
  return t('txManager.receive')
}

export const getTxProgressStatus = (txTracker: TxTracker): TxProgressStatus => {
  if (txTracker.status === TxTrackerStatus.Failed) return 'failed'

  if (txTracker.status === TxTrackerStatus.Success) {
    if (txTracker.refunded) {
      return 'refunded'
    }

    return 'success'
  }

  return 'pending'
}

//TODO - add translations
export const getSwapOutTxData = async (
  txTracker: TxTracker,
): Promise<string | null> => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out[0]
    const asset = Asset.fromAssetString(outTx?.coins?.[0]?.asset)

    if (asset) {
      await asset?.setDecimal()

      const amount = Amount.fromMidgard(outTx?.coins?.[0]?.amount)

      if (action.type === ActionTypeEnum.Swap) {
        if (txTracker.type === TxTrackerType.Swap) {
          return t('txManager.receivedAmountAsset', {
            amount: amount.toSignificant(6),
            asset: asset.name,
          })
        }

        if (txTracker.type === TxTrackerType.Mint) {
          return t('txManager.mintedAmountAsset', {
            amount: amount.toSignificant(6),
            asset: asset.name,
          })
        }

        if (txTracker.type === TxTrackerType.Redeem) {
          return t('txManager.redeemedAmountAsset', {
            amount: amount.toSignificant(6),
            asset: asset.name,
          })
        }
      }

      if (action.type === ActionTypeEnum.Refund) {
        return t('txManager.refundedAmountAsset', {
          amount: amount.toSignificant(6),
          asset: asset.name,
        })
      }
    }
  }

  return null
}

export const getSwapInTxUrl = (txTracker: TxTracker): string => {
  const { submitTx } = txTracker

  if (submitTx?.txID) {
    const { inAssets = [], txID } = submitTx
    const asset = Asset.fromAssetString(inAssets[0].asset)

    if (asset) {
      return multichain.getExplorerTxUrl(asset.L1Chain, txID)
    }
  }

  return '#'
}

export const getSwapOutTxUrl = (txTracker: TxTracker): string => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out[0]
    const asset = Asset.fromAssetString(outTx?.coins?.[0]?.asset)

    if (asset) {
      // add 0x for eth tx
      if (asset.L1Chain === 'ETH') {
        return multichain.getExplorerTxUrl(asset.L1Chain, `0x${outTx?.txID}`)
      }
      return multichain.getExplorerTxUrl(asset.L1Chain, outTx?.txID)
    }
  }

  return '#'
}

export const getAddTxUrl = ({
  asset,
  txTracker,
}: {
  asset: Asset
  txTracker: TxTracker
}): string => {
  const { action, submitTx } = txTracker

  if (action?.in) {
    const inTx = action.in.find(
      (inData: Transaction) => inData.coins?.[0].asset === asset?.toString(),
    )

    if (inTx) {
      // add 0x for eth tx
      if (asset.L1Chain === 'ETH') {
        return multichain.getExplorerTxUrl(asset.L1Chain, `0x${inTx?.txID}`)
      }

      return multichain.getExplorerTxUrl(asset.L1Chain, inTx?.txID)
    }
  } else if (submitTx.addTx) {
    const { addTx } = submitTx

    if (asset.isRUNE() && addTx.runeTxID) {
      return multichain.getExplorerTxUrl(asset.L1Chain, addTx.runeTxID)
    }

    if (addTx.assetTxID) {
      return multichain.getExplorerTxUrl(asset.L1Chain, addTx.assetTxID)
    }
  }

  return '#'
}

export const getWithdrawSubmitTxUrl = (txTracker: TxTracker): string => {
  const { submitTx } = txTracker

  if (submitTx?.txID && submitTx?.withdrawChain) {
    const { withdrawChain, txID } = submitTx

    return multichain.getExplorerTxUrl(withdrawChain, txID)
  }

  return '#'
}

export const getWithdrawTxUrl = ({
  asset,
  txTracker,
}: {
  asset: Asset
  txTracker: TxTracker
}): string => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out.find(
      (data: Transaction) => data.coins?.[0].asset === asset?.toString(),
    )

    if (outTx) {
      // add 0x for eth tx
      if (asset.L1Chain === 'ETH') {
        return multichain.getExplorerTxUrl(asset.L1Chain, `0x${outTx?.txID}`)
      }
      return multichain.getExplorerTxUrl(asset.L1Chain, outTx?.txID)
    }
  }

  return '#'
}

export const getApproveTxUrl = (txTracker: TxTracker): string => {
  const { submitTx } = txTracker

  if (submitTx?.txID) {
    const { inAssets = [], txID } = submitTx
    const asset = Asset.fromAssetString(inAssets[0].asset)

    if (asset) {
      return multichain.getExplorerTxUrl(asset.L1Chain, txID)
    }
  }

  return '#'
}

export const getSendTxUrl = (txTracker: TxTracker): string => {
  const { submitTx } = txTracker

  if (submitTx?.txID) {
    const { inAssets = [], txID } = submitTx
    const asset = Asset.fromAssetString(inAssets[0].asset)

    if (asset) {
      return multichain.getExplorerTxUrl(asset.L1Chain, txID)
    }
  }

  return '#'
}

export const getTxTrackerUrl = (txId: string) => {
  if (!txId) {
    return ''
  }

  return `https://app.thoryield.com/tx_tracker?tx=${txId}`
}
