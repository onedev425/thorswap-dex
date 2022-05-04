import { useEffect, useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { TxProgressStatus } from 'components/TxManager/types'

import { TxTracker, TxTrackerStatus, TxTrackerType } from 'store/midgard/types'

import { t } from 'services/i18n'

import {
  getAddTxUrl,
  getApproveTxUrl,
  getSendTxUrl,
  getSwapInTxUrl,
  getSwapOutTxData,
  getSwapOutTxUrl,
  getSwapReceiveTitle,
  getSwapSendTitle,
  getWithdrawSubmitTxUrl,
  getWithdrawTxUrl,
  isSwapType,
} from '../utils'

export type TxDetails = {
  label: string
  status: TxProgressStatus
  url?: string
}[]

export const useTxDetails = (txTracker: TxTracker) => {
  const [outTxData, setOutTxData] = useState('')

  useEffect(() => {
    const getSwapTxData = async () => {
      const txOutData = await getSwapOutTxData(txTracker)

      if (txOutData) {
        setOutTxData(txOutData)
      }
    }

    if (
      txTracker.type === TxTrackerType.Swap &&
      txTracker.status === TxTrackerStatus.Success
    ) {
      getSwapTxData()
    }
  }, [txTracker])

  const txDetails = useMemo(
    () => getTxDetails(txTracker, outTxData)?.filter((item) => item.label),
    [outTxData, txTracker],
  )

  return txDetails
}

const getTxDetails = (
  txTracker: TxTracker,
  outTxData: string,
): TxDetails | null => {
  if (isSwapType(txTracker)) {
    return getSwapDetails(txTracker, outTxData)
  }

  if (txTracker.type === TxTrackerType.AddLiquidity) {
    return getAddLiquidityDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Withdraw) {
    return getWithdrawDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Switch) {
    return getSwitchDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Approve) {
    return getApproveDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Send) {
    return getSendDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Stake) {
    return getStakeDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Claim) {
    return getClaimDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.StakeExit) {
    return getStakeWithdrawDetails(txTracker)
  }

  if (txTracker.type === TxTrackerType.Unstake) {
    return getUnstakeDetails(txTracker)
  }

  return null
}

const getSwapDetails = (txTracker: TxTracker, outTxData: string): TxDetails => {
  const { status, submitTx } = txTracker

  const { inAssets = [], outAssets = [] } = submitTx
  const { asset: sendAsset, amount: sendAmount } = inAssets[0]
  const { asset: receiveAsset, amount: receiveAmount } = outAssets[0]

  const sendTitle = getSwapSendTitle({
    sendAsset,
    receiveAsset,
  })

  const receiveTitle = getSwapReceiveTitle({
    sendAsset,
    receiveAsset,
  })

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: `${sendTitle} ${sendAmount} ${
          Asset.fromAssetString(sendAsset)?.name
        }${' '}${t('txManager.failed')}`,
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: status === TxTrackerStatus.Submitting ? 'pending' : 'success',
      label: `${sendTitle} ${sendAmount} ${
        Asset.fromAssetString(sendAsset)?.name
      }`,
      url:
        status !== TxTrackerStatus.Submitting ? getSwapInTxUrl(txTracker) : '',
    },
  ]

  if (status !== TxTrackerStatus.Submitting) {
    let label = ''
    if (status === TxTrackerStatus.Pending) {
      label = `${receiveTitle} ${receiveAmount} ${
        Asset.fromAssetString(receiveAsset)?.name
      }`
    }

    if (status === TxTrackerStatus.Success && outTxData) {
      label = outTxData
    }

    txDetails.push({
      status: status === TxTrackerStatus.Success ? 'success' : 'pending',
      label,
      url: status === TxTrackerStatus.Success ? getSwapOutTxUrl(txTracker) : '',
    })
  }

  return txDetails
}

const getAddLiquidityDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const isPending = status !== TxTrackerStatus.Success

  const txDetails: TxDetails = []

  if (txTracker.refunded) {
    txDetails.push({
      status: 'refunded',
      label: t('components.txTracker.refunded'),
    })
  } else {
    const { inAssets = [] } = submitTx

    inAssets.map(({ asset, amount }) => {
      const assetObj = Asset.fromAssetString(asset)
      if (!assetObj) return null

      txDetails.push({
        status: isPending ? 'pending' : 'success',
        label: isPending
          ? t('txManager.addAmountAsset', { amount, asset: assetObj?.ticker })
          : t('txManager.addedAmountAsset', {
              amount,
              asset: assetObj?.ticker,
            }),
        url:
          status !== TxTrackerStatus.Submitting
            ? getAddTxUrl({ asset: assetObj, txTracker })
            : '',
      })
    })
  }

  return txDetails
}

const getWithdrawDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const isPending = status !== TxTrackerStatus.Success

  const txDetails: TxDetails = [
    {
      status: status === TxTrackerStatus.Submitting ? 'pending' : 'success',
      label: t('txManager.submitWithdrawTx'),
      url:
        status !== TxTrackerStatus.Submitting
          ? getWithdrawSubmitTxUrl(txTracker)
          : '',
    },
  ]

  if (txTracker.refunded) {
    txDetails.push({
      status: 'refunded',
      label: t('txManager.refunded'),
    })
  } else if (status !== TxTrackerStatus.Submitting) {
    const { outAssets = [] } = submitTx

    outAssets.map(({ asset, amount }) => {
      const assetObj = Asset.fromAssetString(asset)
      if (!assetObj) return null

      txDetails.push({
        status: isPending ? 'pending' : 'success',
        label: isPending
          ? t('txManager.withdrawAmountAsset', {
              amount,
              asset: assetObj?.ticker,
            })
          : t('txManager.withdrawnAmountAsset', {
              amount,
              asset: assetObj?.ticker,
            }),
        url:
          status === TxTrackerStatus.Success
            ? getWithdrawTxUrl({ asset: assetObj, txTracker })
            : '',
      })
    })
  }

  return txDetails
}

const getSwitchDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [], outAssets = [] } = submitTx
  const { asset: sendAsset, amount: sendAmount } = inAssets[0]
  const { amount: receiveAmount } = outAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  const txDetails: TxDetails = [
    {
      status: status === TxTrackerStatus.Submitting ? 'pending' : 'success',
      label: `${t('common.send')} ${sendAmount} ${
        Asset.fromAssetString(sendAsset)?.L1Chain
      }${' '}${Asset.fromAssetString(sendAsset)?.ticker}`,
      url:
        status !== TxTrackerStatus.Submitting ? getSwapInTxUrl(txTracker) : '',
    },
  ]

  if (status !== TxTrackerStatus.Submitting) {
    txDetails.push({
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.receiveAmountNativeRune', { amount: receiveAmount })
        : t('txManager.receivedAmountNativeRune', { amount: receiveAmount }),
      url: status === TxTrackerStatus.Success ? getSwapOutTxUrl(txTracker) : '',
    })
  }

  return txDetails
}

const getApproveDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: approveAsset } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.approveAssetFailed', {
          asset: Asset.fromAssetString(approveAsset)?.ticker,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.approveAsset', {
            asset: Asset.fromAssetString(approveAsset)?.ticker,
          })
        : t('txManager.approvedAsset', {
            asset: Asset.fromAssetString(approveAsset)?.ticker,
          }),
      url: getApproveTxUrl(txTracker),
    },
  ]

  return txDetails
}

const getStakeDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: stakeAsset, amount } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.stakeAssetFailed', {
          asset: Asset.fromAssetString(stakeAsset)?.ticker,
          amount,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.stakeAsset', {
            amount,
            asset: Asset.fromAssetString(stakeAsset)?.ticker,
          })
        : t('txManager.stakedAsset', {
            amount,
            asset: Asset.fromAssetString(stakeAsset)?.ticker,
          }),
      url: getApproveTxUrl(txTracker),
    },
  ]

  return txDetails
}

const getClaimDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: claimAsset, amount } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.claimAssetFailed', {
          amount,
          asset: Asset.fromAssetString(claimAsset)?.ticker,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.claimAsset', {
            amount,
            asset: Asset.fromAssetString(claimAsset)?.ticker,
          })
        : t('txManager.claimedAsset', {
            amount,
            asset: Asset.fromAssetString(claimAsset)?.ticker,
          }),
      url: getApproveTxUrl(txTracker),
    },
  ]

  return txDetails
}

const getStakeWithdrawDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: withdrawAsset, amount } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.withdrawAmountFailed', {
          amount,
          asset: Asset.fromAssetString(withdrawAsset)?.ticker,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.withdrawAmountAsset', {
            amount,
            asset: Asset.fromAssetString(withdrawAsset)?.ticker,
          })
        : t('txManager.withdrawnAmountAsset', {
            amount,
            asset: Asset.fromAssetString(withdrawAsset)?.ticker,
          }),
      url: getApproveTxUrl(txTracker),
    },
  ]

  return txDetails
}

const getUnstakeDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: unstakeAsset, amount } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.unstakeFailed', {
          amount,
          asset: Asset.fromAssetString(unstakeAsset)?.ticker,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.unstakeAsset', {
            amount,
            asset: Asset.fromAssetString(unstakeAsset)?.ticker,
          })
        : t('txManager.unstakedAsset', {
            amount,
            asset: Asset.fromAssetString(unstakeAsset)?.ticker,
          }),
      url: getApproveTxUrl(txTracker),
    },
  ]

  return txDetails
}

const getSendDetails = (txTracker: TxTracker): TxDetails => {
  const { status, submitTx } = txTracker
  const { inAssets = [] } = submitTx
  const { asset: sendAsset, amount } = inAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: t('txManager.sendFailed', {
          asset: Asset.fromAssetString(sendAsset)?.ticker,
          amount,
        }),
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.sendAmountAsset', {
            asset: Asset.fromAssetString(sendAsset)?.ticker,
            amount,
          })
        : t('txManager.sendFinished', {
            asset: Asset.fromAssetString(sendAsset)?.ticker,
            amount,
          }),
      url: getSendTxUrl(txTracker),
    },
  ]

  return txDetails
}
