import { useCallback, useMemo, useState } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import dayjs from 'dayjs'
import { BigNumber } from 'ethers'

import {
  defaultVestingInfo,
  vestingAssets,
  VestingScheduleInfo,
  VestingType,
} from 'views/Vesting/types'

import { showErrorToast } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useTxTracker } from 'hooks/useTxTracker'

import {
  ContractType,
  fromWei,
  getEtherscanContract,
  toWei,
  triggerContractCall,
} from 'services/contract'
import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { toOptionalFixed } from 'helpers/number'

export const useVesting = () => {
  const [vestingAction, setVestingAction] = useState(VestingType.THOR)
  const [vestingInfo, setVestingInfo] =
    useState<VestingScheduleInfo>(defaultVestingInfo)
  const [isFetching, setIsFetching] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [tokenAmount, setTokenAmount] = useState(Amount.fromNormalAmount(0))

  const { wallet, setIsConnectModalOpen } = useWallet()
  const { setTxFailed, submitTransaction, subscribeEthTx } = useTxTracker()

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet])

  const getVestingInfo = useCallback(
    async (type: VestingType) => {
      if (ethAddr) {
        try {
          const vestingContract = getEtherscanContract(
            type === VestingType.THOR
              ? ContractType.VESTING
              : ContractType.VTHOR_VESTING,
          )

          const totalAlloc = await vestingContract.vestingSchedule(ethAddr)

          const claimableAmount = await vestingContract.claimableAmount(ethAddr)
          const info = {
            totalVestedAmount: fromWei(totalAlloc[0]).toString(),
            totalClaimedAmount: fromWei(totalAlloc[1]),
            startTime: dayjs.unix(totalAlloc[2]).format('YYYY-MM-DD HH:MM:SS'),
            vestingPeriod: dayjs.duration(totalAlloc[3] * 1000).asDays() / 365,
            cliff: dayjs.duration(totalAlloc[4] * 1000).asDays() / 30,
            initialRelease: fromWei(totalAlloc[5]).toString(),
            claimableAmount: fromWei(claimableAmount),
            hasAlloc:
              BigNumber.from(totalAlloc[0]).gt(0) ||
              BigNumber.from(totalAlloc[1]).gt(0),
          }

          setVestingInfo(info)

          return info
        } catch (err) {
          console.log('ERR - ', err)
        }
      }
    },
    [ethAddr],
  )

  const handleChangePercent = useCallback(
    (percent: number) => {
      setTokenAmount(
        Amount.fromNormalAmount((vestingInfo.claimableAmount * percent) / 100),
      )
    },
    [vestingInfo],
  )

  const handleChangeTokenAmount = useCallback((value: Amount) => {
    setTokenAmount(value)
  }, [])

  const handleVestingInfo = useCallback(async () => {
    setIsFetching(true)

    try {
      if (ethAddr) await getVestingInfo(vestingAction)
      else setVestingInfo(defaultVestingInfo)
    } catch {
      setVestingInfo(defaultVestingInfo)
    }

    setIsFetching(false)
  }, [ethAddr, getVestingInfo, vestingAction])

  const hasVestingAlloc = useCallback(async () => {
    const promises = [
      getVestingInfo(VestingType.THOR),
      getVestingInfo(VestingType.VTHOR),
    ]
    const infos = await Promise.all(promises)
    return infos?.[0]?.hasAlloc || infos?.[1]?.hasAlloc || false
  }, [getVestingInfo])

  const handleClaim = useCallback(async () => {
    if (ethAddr) {
      const currentClaimableAmount = toWei(tokenAmount.assetAmount.toNumber())

      setIsClaiming(true)

      let trackId = ''

      try {
        trackId = submitTransaction({
          type: TxTrackerType.Claim,
          submitTx: {
            inAssets: [
              {
                asset: vestingAssets[vestingAction].toString(),
                amount: toOptionalFixed(fromWei(currentClaimableAmount)),
              },
            ],
          },
        })

        const res = await triggerContractCall(
          multichain,
          vestingAction === VestingType.THOR
            ? ContractType.VESTING
            : ContractType.VTHOR_VESTING,
          'claim',
          [currentClaimableAmount],
        )

        const txHash = res?.hash

        if (txHash) {
          subscribeEthTx({
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: vestingAssets[vestingAction].toString(),
                  amount: toOptionalFixed(fromWei(currentClaimableAmount)),
                },
              ],
              txID: txHash,
            },
            txHash,
            callback: handleVestingInfo,
          })
        }
      } catch (err) {
        setTxFailed(trackId)
        showErrorToast(t('notification.submitFail'), t('common.defaultErrMsg'))
      }

      setIsClaiming(false)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [
    vestingAction,
    tokenAmount,
    ethAddr,
    handleVestingInfo,
    setIsConnectModalOpen,
    setTxFailed,
    submitTransaction,
    subscribeEthTx,
  ])

  return {
    setVestingAction,
    vestingInfo,
    isFetching,
    handleVestingInfo,
    handleClaim,
    isClaiming,
    ethAddr,
    vestingAction,
    tokenAmount,
    setIsConnectModalOpen,
    handleChangePercent,
    handleChangeTokenAmount,
    hasVestingAlloc,
  }
}
