import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

import { TxProgressStatus } from 'components/TxManager/types'

import {
  TxTracker,
  TxTrackerStatus,
  TxTrackerType,
  AggregatorSwapType,
} from 'store/midgard/types'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { chainName } from 'helpers/chainName'

import {
  getAddTxUrl,
  getApproveTxUrl,
  getSendTxUrl,
  getSwapInTxUrl,
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
  const txDetails = useMemo(
    () => getTxDetails(txTracker)?.filter((item) => item.label),
    [txTracker],
  )

  return txDetails
}

const getTxDetails = (txTracker: TxTracker): TxDetails | null => {
  if (isSwapType(txTracker)) {
    return getSwapDetails(txTracker)
  }

  switch (txTracker.type) {
    case TxTrackerType.AddLiquidity:
      return getAddLiquidityDetails(txTracker)
    case TxTrackerType.Withdraw:
      return getWithdrawDetails(txTracker)
    case TxTrackerType.Switch:
      return getSwitchDetails(txTracker)
    case TxTrackerType.Approve:
      return getApproveDetails(txTracker)
    case TxTrackerType.Send:
      return getSendDetails(txTracker)
    case TxTrackerType.Stake:
      return getStakeDetails(txTracker)
    case TxTrackerType.Claim:
      return getClaimDetails(txTracker)
    case TxTrackerType.StakeExit:
      return getStakeWithdrawDetails(txTracker)
    case TxTrackerType.UpdateThorname:
    case TxTrackerType.RegisterThorname:
      return getThornameDetails(txTracker)
    case TxTrackerType.Unstake:
      return getUnstakeDetails(txTracker)

    default:
      return null
  }
}

const getSwapDetails = ({ status, submitTx, action }: TxTracker): TxDetails => {
  const { inAssets = [], outAssets = [], aggType } = submitTx
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

  const sendTicker = Asset.fromAssetString(sendAsset)?.name
  const receiveTicker = Asset.fromAssetString(receiveAsset)?.name

  if (status === TxTrackerStatus.Failed) {
    return [
      {
        status: 'failed',
        label: `${sendTitle} ${sendAmount} ${sendTicker} ${t(
          'txManager.failed',
        )}`,
      },
    ]
  }

  const txDetails: TxDetails = [
    {
      status: status === TxTrackerStatus.Submitting ? 'pending' : 'success',
      label: `${sendTitle} ${sendAmount} ${sendTicker}`,
      url:
        status !== TxTrackerStatus.Submitting ? getSwapInTxUrl(submitTx) : '',
    },
  ]

  if (status !== TxTrackerStatus.Submitting) {
    txDetails.push({
      status: status === TxTrackerStatus.Success ? 'success' : 'pending',
      label: `${receiveTitle} ${receiveAmount} ${receiveTicker}`,
      url:
        status === TxTrackerStatus.Success
          ? aggType === AggregatorSwapType.SwapIn
            ? getSwapInTxUrl(submitTx)
            : getSwapOutTxUrl(action)
          : '',
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

const getSwitchDetails = ({
  action,
  status,
  submitTx,
}: TxTracker): TxDetails => {
  const { inAssets = [], outAssets = [] } = submitTx
  const { asset: sendAsset, amount: sendAmount } = inAssets[0]
  const { amount: receiveAmount } = outAssets[0]
  const isPending = status !== TxTrackerStatus.Success

  const txDetails: TxDetails = [
    {
      status: status === TxTrackerStatus.Submitting ? 'pending' : 'success',
      label: `${t('common.send')} ${sendAmount} ${chainName(
        Asset.fromAssetString(sendAsset)?.L1Chain || '',
      )}${' '}${Asset.fromAssetString(sendAsset)?.ticker}`,
      url:
        status !== TxTrackerStatus.Submitting ? getSwapInTxUrl(submitTx) : '',
    },
  ]

  if (status !== TxTrackerStatus.Submitting) {
    txDetails.push({
      status: isPending ? 'pending' : 'success',
      label: isPending
        ? t('txManager.receiveAmountNativeRune', { amount: receiveAmount })
        : t('txManager.receivedAmountNativeRune', { amount: receiveAmount }),
      url: status === TxTrackerStatus.Success ? getSwapOutTxUrl(action) : '',
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

const getThornameDetails = ({
  type,
  status,
  submitTx,
}: TxTracker): TxDetails => {
  const failed = status === TxTrackerStatus.Failed
  const pending = status !== TxTrackerStatus.Success

  const typeText =
    type === TxTrackerType.RegisterThorname
      ? t('txManager.registerThorname')
      : t('txManager.updateThorname')

  const txDetails: TxDetails = [
    {
      status: failed ? 'failed' : pending ? 'pending' : 'success',
      label: failed
        ? `${typeText} ${t('txManager.failed')}`
        : pending
        ? typeText
        : `${typeText} ${t('txManager.success')}`,
      url: submitTx.txID
        ? multichain().getExplorerTxUrl(Chain.THORChain, submitTx.txID)
        : '',
    },
  ]

  return txDetails
}
