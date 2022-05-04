import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Icon, Typography } from 'components/Atomic'

import { TxTracker, TxTrackerType } from 'store/midgard/types'

import { t } from 'services/i18n'

import { isSwapType } from '../utils'

type Props = {
  txInfo: TxTracker
}

export const TxHeader = ({ txInfo }: Props) => {
  const { type, submitTx } = txInfo

  if (type === TxTrackerType.Send) {
    const { inAssets = [] } = submitTx
    const { asset: sendAsset } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.send', {
            token: Asset.fromAssetString(sendAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.Approve) {
    const { inAssets = [] } = submitTx
    const { asset: approveAsset } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.approveToken', {
            token: Asset.fromAssetString(approveAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.Stake) {
    const { inAssets = [] } = submitTx
    const { asset: approveAsset, amount } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.stakeAsset', {
            amount,
            asset: Asset.fromAssetString(approveAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.Claim) {
    const { inAssets = [] } = submitTx
    const { asset: claimAsset, amount } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.claimAsset', {
            amount,
            asset: Asset.fromAssetString(claimAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.StakeExit) {
    const { inAssets = [] } = submitTx
    const { asset: withdrawAsset, amount } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.withdrawAmountAsset', {
            amount,
            asset: Asset.fromAssetString(withdrawAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.Unstake) {
    const { inAssets = [] } = submitTx
    const { asset: unstakeAsset, amount } = inAssets[0]

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {t('txManager.unstakeAsset', {
            amount,
            asset: Asset.fromAssetString(unstakeAsset)?.ticker,
          })}
        </Typography>
      </Box>
    )
  }

  if (isSwapType(txInfo)) {
    const { inAssets = [], outAssets = [] } = submitTx

    const { asset: sendAsset, amount: sendAmount } = inAssets[0]
    const { asset: receiveAsset, amount: receiveAmount } = outAssets[0]

    const sendAssetName = Asset.fromAssetString(sendAsset)?.name
    const receiveAssetName = Asset.fromAssetString(receiveAsset)?.name

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {`${sendAmount} ${sendAssetName}`}
        </Typography>
        <Icon name="arrowRight" color="secondary" size={16} />
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {`${receiveAmount} ${receiveAssetName}`}
        </Typography>
      </Box>
    )
  }

  if (type === TxTrackerType.AddLiquidity) {
    const { inAssets = [] } = submitTx

    // sym add liquidity
    if (inAssets.length === 2) {
      const { asset: sendAsset1, amount: sendAmount1 } = inAssets[0]
      const { asset: sendAsset2, amount: sendAmount2 } = inAssets[1]
      const sendAsset1Name = Asset.fromAssetString(sendAsset1)?.name
      const sendAsset2Name = Asset.fromAssetString(sendAsset2)?.name

      return (
        <Box className="gap-x-1" alignCenter row>
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${sendAmount1} ${sendAsset1Name}`}
          </Typography>
          <Icon name="plus" color="secondary" size={16} />
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${sendAmount2} ${sendAsset2Name}`}
          </Typography>
        </Box>
      )
    }

    // asym add
    if (inAssets.length === 1) {
      const { asset: sendAsset1, amount: sendAmount1 } = inAssets[0]
      const sendAsset1Name = Asset.fromAssetString(sendAsset1)?.name

      return (
        <Box className="gap-x-1" alignCenter row>
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${sendAmount1} ${sendAsset1Name}`}
          </Typography>
        </Box>
      )
    }
  }

  if (type === TxTrackerType.Withdraw) {
    const { outAssets = [] } = submitTx

    // sym add liquidity
    if (outAssets.length === 2) {
      const { asset: withdrawAsset1, amount: withdrawAmount1 } = outAssets[0]
      const { asset: withdrawAsset2, amount: withdrawAmount2 } = outAssets[1]
      const withdrawAsset1Name = Asset.fromAssetString(withdrawAsset1)?.name
      const withdrawAsset2Name = Asset.fromAssetString(withdrawAsset2)?.name

      return (
        <Box className="gap-x-1" alignCenter row>
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${withdrawAmount1} ${withdrawAsset1Name}`}
          </Typography>
          <Icon name="plus" color="secondary" size={16} />
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${withdrawAmount2} ${withdrawAsset2Name}`}
          </Typography>
        </Box>
      )
    }

    // asym add
    if (outAssets.length === 1) {
      const { asset: withdrawAsset1, amount: withdrawAmount1 } = outAssets[0]
      const withdrawAsset1Name = Asset.fromAssetString(withdrawAsset1)?.name

      return (
        <Box className="gap-x-1" alignCenter row>
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {`${withdrawAmount1} ${withdrawAsset1Name}`}
          </Typography>
        </Box>
      )
    }
  }

  if (type === TxTrackerType.Switch) {
    const { inAssets = [] } = submitTx
    const { asset: sendAsset, amount: sendAmount } = inAssets[0]
    const chain = Asset.fromAssetString(sendAsset)?.chain
    const ticker = Asset.fromAssetString(sendAsset)?.ticker

    return (
      <Box className="gap-x-1" alignCenter row>
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          {`${sendAmount} ${chain} ${ticker}`}
        </Typography>
        <Icon name="switch" color="secondary" size={16} />
        <Typography variant="caption" color="secondary" fontWeight="semibold">
          Native
        </Typography>
      </Box>
    )
  }

  return <></>
}
