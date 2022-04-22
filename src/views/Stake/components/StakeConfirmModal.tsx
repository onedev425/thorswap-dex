import { useCallback, useEffect, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { BigNumber } from 'ethers'

import { FarmActionType } from 'views/Stake/types'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { Input } from 'components/Input'
import { PercentSelect } from 'components/PercentSelect/PercentSelect'
import { showToast, ToastType } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApproveContract'
import { useTxTracker } from 'hooks/useTxTracker'

import {
  ContractType,
  fromWei,
  toWei,
  getContractAddress,
} from 'services/contract'
import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

const actionNameKey: Record<FarmActionType, string> = {
  [FarmActionType.DEPOSIT]: 'views.staking.depositAction',
  [FarmActionType.CLAIM]: 'views.staking.harvestAction',
  [FarmActionType.WITHDRAW]: 'views.staking.withdrawAction',
  [FarmActionType.EXIT]: 'views.staking.exitAction',
}

type Props = {
  isOpened: boolean
  farmName: string
  type: FarmActionType
  tokenBalance: BigNumber
  stakedAmount: BigNumber
  claimableAmount: BigNumber
  lpAsset: Asset
  contractType: ContractType
  onConfirm: (tokenAmount: BigNumber) => void
  onCancel: () => void
}

export const StakeConfirmModal = ({
  isOpened,
  type,
  contractType,
  lpAsset,
  tokenBalance,
  stakedAmount,
  claimableAmount,
  onConfirm,
  onCancel,
}: Props) => {
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0))
  const { submitTransaction, setTxFailed, subscribeEthTx } = useTxTracker()
  const { wallet } = useWallet()
  const { isApproved } = useApprove(
    lpAsset,
    getContractAddress(contractType),
    !!wallet,
  )

  const actionLabel = t(actionNameKey[type])
  const isClaim = type === FarmActionType.CLAIM

  const handleChangeAmount = useCallback(
    (percent: number) => {
      if (type === FarmActionType.DEPOSIT) {
        setAmount(tokenBalance.mul(percent).div(100))
      } else if (type === FarmActionType.CLAIM) {
        setAmount(claimableAmount.mul(percent).div(100))
      } else if (type === FarmActionType.WITHDRAW) {
        setAmount(stakedAmount.mul(percent).div(100))
      }
    },
    [type, tokenBalance, claimableAmount, stakedAmount],
  )

  const onAmountUpdate = useCallback((val: string) => {
    // logic to update amount
    setAmount(toWei(BigNumber.from(val).toNumber()))
  }, [])

  const onPercentSelect = useCallback(
    (val: number) => {
      handleChangeAmount(val)
    },
    [handleChangeAmount],
  )

  const handleConfirm = useCallback(() => {
    onConfirm(amount)
  }, [amount, onConfirm])

  const handleConfirmApprove = useCallback(async () => {
    if (wallet) {
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx: {
          inAssets: [
            {
              asset: lpAsset.toString(),
              amount: '0', // not needed for approve tx
            },
          ],
        },
      })

      try {
        const txHash = await multichain.approveAssetForStaking(
          lpAsset,
          getContractAddress(contractType),
        )

        if (txHash) {
          subscribeEthTx({
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: lpAsset.toString(),
                  amount: '0', // not needed for approve tx
                },
              ],
              txID: txHash,
            },
            txHash,
          })
        }
      } catch (error) {
        setTxFailed(trackId)
        showToast({ message: t('notification.approveFailed') }, ToastType.Error)
        console.log(error)
      }
    }
  }, [
    contractType,
    lpAsset,
    wallet,
    setTxFailed,
    submitTransaction,
    subscribeEthTx,
  ])

  useEffect(() => {
    handleChangeAmount(100)
  }, [handleChangeAmount])

  return (
    <Modal title={actionLabel} isOpened={isOpened} onClose={onCancel}>
      <Box className="w-full md:w-atuo md:!min-w-[350px]" col flex={1}>
        <InfoRow
          label={t('views.staking.tokenBalance')}
          value={fromWei(tokenBalance).toLocaleString() || 'N/A'}
        />
        <InfoRow
          label={t('views.staking.tokenStaked')}
          value={fromWei(stakedAmount).toString() || 'N/A'}
        />
        <InfoRow
          label={t('views.staking.claimable')}
          value={fromWei(claimableAmount).toFixed(2) || 'N/A'}
        />

        {!isClaim && (
          <>
            <Box className="gap-3 !mt-8" alignCenter>
              <Typography>
                {t('views.staking.stakeActionAmount', {
                  stakeAction: actionLabel,
                })}
              </Typography>
              <Input
                className="text-right"
                border="rounded"
                value={fromWei(amount).toString()}
                onChange={(e) => onAmountUpdate(e.target.value)}
              />
            </Box>

            <Box className="!mt-4 flex-1">
              <PercentSelect
                options={[25, 50, 75, 100]}
                onSelect={onPercentSelect}
              />
            </Box>
          </>
        )}

        <Box className="gap-3 !mt-8">
          {type === FarmActionType.DEPOSIT && isApproved === false && wallet && (
            <Button
              isFancy
              stretch
              variant="primary"
              onClick={handleConfirmApprove}
            >
              {t('txManager.approve')}
            </Button>
          )}
          {isApproved && (
            <Button isFancy onClick={handleConfirm} stretch variant="primary">
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
