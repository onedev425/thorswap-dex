// TODO: DO NOT REMOVE ANY SINGLE COMMENT.
// It has some comments to support THOR, vTHOR vesting together.
// All comments will be used once the vTHOR vesting contract is ready.

import { useEffect } from 'react'

import { useVesting } from 'views/Vesting/hooks'

import { Box, Button, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { InfoRow } from 'components/InfoRow'
import { InputAmount } from 'components/InputAmount'
import { PanelView } from 'components/PanelView'
import { PercentSelect } from 'components/PercentSelect/PercentSelect'
import { TabsSelect } from 'components/TabsSelect'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { toOptionalFixed } from 'helpers/number'

import { vestingTabs, VestingType } from './types'

const Vesting = () => {
  const {
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
  } = useVesting()

  useEffect(() => {
    handleVestingInfo()
  }, [handleVestingInfo])

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
