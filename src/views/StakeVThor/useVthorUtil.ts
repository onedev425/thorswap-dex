import { useCallback, useEffect, useState } from 'react'

// import { ETH_DECIMAL } from '@thorswap-lib/multichain-sdk'
// import { baseAmount } from '@thorswap-lib/xchain-util'
import { BigNumber } from 'ethers'

import { showToast, ToastType } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useTxTracker } from 'hooks/useTxTracker'

import { ContractType, fromWei, triggerContractCall } from 'services/contract'
import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { toOptionalFixed } from 'helpers/number'

import {
  getStakedThorAmount,
  getVthorState,
  getV2Address,
  getV2Asset,
  StakingV2Type,
} from './utils'

export const useVthorUtil = () => {
  // total amount staked in vTHOR contract
  const [thorStaked, setThorStaked] = useState(BigNumber.from(0))
  // vTHOR total supply
  const [vthorTS, setVthorTS] = useState(BigNumber.from(0))
  // approval status
  const [isTHORApproved, setTHORApproved] = useState(false)
  const [thorRedeemable, setTHORRedeemable] = useState(0)
  const [vthorBalance, setVthorBalance] = useState(BigNumber.from(0))

  const { setTxFailed, submitTransaction, subscribeEthTx } = useTxTracker()
  const { wallet } = useWallet()

  const getApprovalStatus = useCallback(async () => {
    const ethAddr = wallet?.ETH?.address

    if (!ethAddr) setTHORApproved(true)

    const ethClient = multichain.eth.getClient()
    const isApproved = await ethClient
      .isApproved({
        contractAddress: getV2Address(StakingV2Type.THOR),
        spenderAddress: getV2Address(StakingV2Type.VTHOR),
      })
      .catch(() => false)

    setTHORApproved(isApproved)
  }, [wallet])

  const getThorStakedInfo = useCallback(async () => {
    const res = await getStakedThorAmount().catch(() => BigNumber.from(0))

    setThorStaked(res)
  }, [])

  const getVthorTS = useCallback(async () => {
    const res = await getVthorState('totalSupply').catch(() =>
      BigNumber.from(0),
    )
    setVthorTS(res)
  }, [])

  const getRate = useCallback(
    (isReverted = false) => {
      const thorStakedNum = fromWei(thorStaked)
      const vthorTSNum = fromWei(vthorTS)

      if (!isReverted) {
        return thorStakedNum === 0
          ? '1 THOR = 1 vTHOR'
          : `1 THOR = ${toOptionalFixed(vthorTSNum / thorStakedNum, 3)} vTHOR`
      }

      return vthorTSNum === 0
        ? '1 vTHOR = 1 THOR'
        : `1 vTHOR = ${toOptionalFixed(thorStakedNum / vthorTSNum, 3)} THOR`
    },
    [thorStaked, vthorTS],
  )

  const approveTHOR = useCallback(async () => {
    const thorAsset = getV2Asset(StakingV2Type.THOR)

    const trackId = submitTransaction({
      type: TxTrackerType.Approve,
      submitTx: {
        inAssets: [
          {
            asset: thorAsset.toString(),
            amount: '0',
          },
        ],
      },
    })

    try {
      const txHash = await multichain.approveAssetForStaking(
        getV2Asset(StakingV2Type.THOR),
        getV2Address(StakingV2Type.VTHOR),
      )

      if (txHash) {
        subscribeEthTx({
          uuid: trackId,
          submitTx: {
            inAssets: [
              {
                asset: thorAsset.toString(),
                amount: '0', // not needed for approve tx
              },
            ],
            txID: txHash,
          },
          txHash,
          callback: getApprovalStatus,
        })
      }
    } catch {
      setTxFailed(trackId)
      showToast({ message: t('notification.approveFailed') }, ToastType.Error)
    }
  }, [getApprovalStatus, submitTransaction, subscribeEthTx, setTxFailed])

  const previewDeposit = useCallback(
    (inputAmount: BigNumber) => {
      const supply = fromWei(vthorTS)

      return supply === 0
        ? fromWei(inputAmount)
        : fromWei(inputAmount.mul(vthorTS).div(thorStaked))
    },
    [thorStaked, vthorTS],
  )

  const previewRedeem = useCallback(
    (inputAmount: BigNumber) => {
      const supply = fromWei(vthorTS)

      return supply === 0
        ? fromWei(inputAmount)
        : fromWei(inputAmount.mul(thorStaked).div(vthorTS))
    },
    [thorStaked, vthorTS],
  )

  const getVthorBalance = useCallback(async () => {
    const ethAddr = wallet?.ETH?.address

    if (!ethAddr) {
      setVthorBalance(BigNumber.from(0))
      return
    }

    const res = await getVthorState('balanceOf', [ethAddr]).catch(() =>
      setVthorBalance(BigNumber.from(0)),
    )

    setVthorBalance(res)
  }, [wallet])

  const getTHORRedeemable = useCallback(async () => {
    const ethAddr = wallet?.ETH?.address

    if (!ethAddr) {
      setTHORRedeemable(0)
      return
    }

    const vThorBal = await getVthorState('balanceOf', [ethAddr]).catch(() =>
      setTHORRedeemable(0),
    )
    const res = await getVthorState('previewRedeem', [vThorBal]).catch(() =>
      setTHORRedeemable(0),
    )

    return setTHORRedeemable(fromWei(res))
  }, [wallet])

  const handleRefresh = useCallback(() => {
    const ethAddr = wallet?.ETH?.address

    getThorStakedInfo()
    getVthorTS()
    getApprovalStatus()
    getTHORRedeemable()

    if (ethAddr) getVthorBalance()
  }, [
    wallet,
    getApprovalStatus,
    getThorStakedInfo,
    getVthorBalance,
    getVthorTS,
    getTHORRedeemable,
  ])

  const stakeThor = useCallback(
    async (stakeAmount: BigNumber, receiverAddr: string) => {
      if (fromWei(stakeAmount) === 0) {
        return
      }

      const thorAsset = getV2Asset(StakingV2Type.THOR)

      // submit transaction for Stake
      const trackId = submitTransaction({
        type: TxTrackerType.Stake,
        submitTx: {
          inAssets: [
            {
              asset: thorAsset.toString(),
              amount: fromWei(stakeAmount).toString(),
            },
          ],
        },
      })

      try {
        const res = await triggerContractCall(
          multichain,
          ContractType.VTHOR,
          'deposit',
          [stakeAmount, receiverAddr],
        )

        const txHash = res?.hash

        if (txHash) {
          subscribeEthTx({
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: thorAsset.toString(),
                  amount: fromWei(stakeAmount).toString(),
                },
              ],
              txID: txHash,
            },
            txHash,
            callback: handleRefresh,
          })
        }
      } catch {
        setTxFailed(trackId)
        showToast(
          {
            message: t('txManager.stakeAssetFailed', {
              amount: fromWei(stakeAmount).toString(),
              asset: thorAsset.ticker,
            }),
          },
          ToastType.Error,
        )
      }
    },
    [handleRefresh, setTxFailed, submitTransaction, subscribeEthTx],
  )

  const unstakeThor = useCallback(
    async (unstakeAmount: BigNumber, receiverAddr: string) => {
      const thorAsset = getV2Asset(StakingV2Type.THOR)

      // TODO: update tracker type and submitTx info
      const trackId = submitTransaction({
        type: TxTrackerType.Unstake,
        submitTx: {
          inAssets: [
            {
              asset: thorAsset.toString(),
              amount: fromWei(unstakeAmount).toString(),
            },
          ],
        },
      })

      try {
        const res = await triggerContractCall(
          multichain,
          ContractType.VTHOR,
          'redeem',
          [unstakeAmount, receiverAddr, receiverAddr],
        )

        const txHash = res?.hash

        if (txHash) {
          subscribeEthTx({
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: thorAsset.toString(),
                  amount: fromWei(unstakeAmount).toString(),
                },
              ],
              txID: txHash,
            },
            txHash,
            callback: handleRefresh,
          })
        }
      } catch {
        setTxFailed(trackId)
        showToast(
          {
            message: t('txManager.redeemedAmountAssetFailed', {
              amount: fromWei(unstakeAmount).toString(),
              asset: thorAsset.ticker,
            }),
          },
          ToastType.Error,
        )
      }
    },
    [handleRefresh, setTxFailed, submitTransaction, subscribeEthTx],
  )

  useEffect(() => handleRefresh(), [handleRefresh])

  return {
    isTHORApproved,
    thorStaked,
    thorRedeemable,
    vthorBalance,
    vthorTS,
    getRate,
    approveTHOR,
    previewDeposit,
    previewRedeem,
    stakeThor,
    unstakeThor,
  }
}
