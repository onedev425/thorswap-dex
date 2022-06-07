// TODO: DO NOT REMOVE ANY SINGLE COMMENT.
// It has some comments to support THOR, vTHOR vesting together.
// All comments will be used once the vTHOR vesting contract is ready.

import { useEffect, useCallback, useMemo, useState } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { Box, Button, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { InfoRow } from 'components/InfoRow'
import { InputAmount } from 'components/InputAmount'
import { PanelView } from 'components/PanelView'
import { PercentSelect } from 'components/PercentSelect/PercentSelect'
import { TabsSelect } from 'components/TabsSelect'
import { showErrorToast } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

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

import {
  defaultVestingInfo,
  vestingTabs,
  vestingAssets,
  VestingScheduleInfo,
  VestingType,
} from './types'

dayjs.extend(duration)

const Vesting = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [tokenAmount, setTokenAmount] = useState(Amount.fromNormalAmount(0))
  const [vestingAction, setVestingAction] = useState(VestingType.THOR)
  const [vestingInfo, setVestingInfo] =
    useState<VestingScheduleInfo>(defaultVestingInfo)

  const { setTxFailed, submitTransaction, subscribeEthTx } = useTxTracker()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet])

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

  const getVestingInfo = useCallback(async () => {
    if (ethAddr) {
      try {
        const vestingContract = getEtherscanContract(
          vestingAction === VestingType.THOR
            ? ContractType.VESTING
            : ContractType.VTHOR_VESTING,
        )

        const totalAlloc = await vestingContract.vestingSchedule(ethAddr)

        const claimableAmount = await vestingContract.claimableAmount(ethAddr)

        setVestingInfo({
          totalVestedAmount: fromWei(totalAlloc[0]).toString(),
          totalClaimedAmount: fromWei(totalAlloc[1]),
          startTime: dayjs.unix(totalAlloc[2]).format('YYYY-MM-DD HH:MM:SS'),
          vestingPeriod: dayjs.duration(totalAlloc[3] * 1000).asDays() / 365,
          cliff: dayjs.duration(totalAlloc[4] * 1000).asDays() / 30,
          initialRelease: fromWei(totalAlloc[5]).toString(),
          claimableAmount: fromWei(claimableAmount),
        })
      } catch (err) {
        console.log('ERR - ', err)
      }
    }
  }, [ethAddr, vestingAction])

  const handleVestingInfo = useCallback(async () => {
    setIsFetching(true)

    try {
      if (ethAddr) await getVestingInfo()
      else setVestingInfo(defaultVestingInfo)
    } catch {
      setVestingInfo(defaultVestingInfo)
    }

    setIsFetching(false)
  }, [ethAddr, getVestingInfo])

  useEffect(() => {
    handleVestingInfo()
  }, [handleVestingInfo])

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

  return (
    <PanelView
      title="Liquidity"
      header={
        <ViewHeader
          title={t('views.vesting.linearVesting')}
          actionsComponent={
            ethAddr && (
              <HoverIcon
                iconName="refresh"
                size={18}
                spin={isFetching}
                onClick={handleVestingInfo}
              />
            )
          }
        />
      }
    >
      <Box className="self-stretch">
        <TabsSelect
          tabs={vestingTabs}
          value={vestingAction}
          onChange={(val: string) => {
            setVestingAction(val as VestingType)
          }}
        />
      </Box>
      <Box className="w-full p-2 pt-0" col>
        <InfoRow
          label={t('views.vesting.totalVested')}
          value={vestingInfo.totalVestedAmount}
        />
        <InfoRow
          label={t('views.vesting.totalClaimed')}
          value={toOptionalFixed(vestingInfo.totalClaimedAmount)}
        />
        <InfoRow
          label={t('views.vesting.vestingStartTime')}
          value={
            vestingInfo.totalVestedAmount === '0'
              ? 'N/A'
              : vestingInfo.startTime
          }
        />
        <InfoRow
          label={t('views.vesting.cliff')}
          value={t('views.vesting.cliffValue', {
            cliff: vestingInfo.cliff,
          })}
        />
        <InfoRow
          label={t('views.vesting.vestingPeriod')}
          value={t('views.vesting.vestingPeriodValue', {
            vestingPeriod: vestingInfo.vestingPeriod,
          })}
        />
        <InfoRow
          label={t('views.vesting.claimableAmount')}
          value={toOptionalFixed(vestingInfo.claimableAmount)}
        />

        {ethAddr && (
          <>
            <Box className="!mt-6" row justify="between" alignCenter>
              <Typography className="pr-4 min-w-fit">
                {t('views.vesting.claimAmount')}
              </Typography>

              <InputAmount
                className="!text-right !text-base"
                stretch
                border="rounded"
                amountValue={tokenAmount}
                onAmountChange={handleChangeTokenAmount}
              />
            </Box>
            <Box className="!mt-4 flex-1">
              <PercentSelect
                options={[25, 50, 75, 100]}
                onSelect={handleChangePercent}
              />
            </Box>
          </>
        )}

        {!ethAddr ? (
          <Button
            isFancy
            stretch
            size="lg"
            className="mt-4"
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        ) : (
          <Button
            isFancy
            stretch
            size="lg"
            className="mt-4"
            loading={isClaiming}
            onClick={handleClaim}
          >
            {t('views.vesting.claim')}
          </Button>
        )}
      </Box>
    </PanelView>
  )
}

export default Vesting
