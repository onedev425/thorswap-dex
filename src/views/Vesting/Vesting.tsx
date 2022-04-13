import { useState } from 'react'

import { Box, Button, Icon, Typography, Select } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const percentageOptions = ['25', '50', '75', '100']

const claimableAmount = 2000

const Vesting = () => {
  const [claimAmount, setClaimAmount] = useState('0')

  const handlePercentagePress = (index: number) => {
    const value = parseInt(percentageOptions[index])
    setClaimAmount(`${claimableAmount * (value / 100)}`)
  }

  const activeIndex = percentageOptions.findIndex(
    (option) =>
      claimableAmount * (parseInt(option) / 100) === parseInt(claimAmount),
  )

  return (
    <PanelView
      title="Liquidity"
      header={
        <ViewHeader
          title={t('views.vesting.linearVesting')}
          actionsComponent={<Icon name="refresh" color="secondary" />}
        />
      }
    >
      <Box className="w-full" col>
        <InfoRow value="N/A" label={t('views.vesting.totalVested')} />
        <InfoRow value="N/A" label={t('views.vesting.totalClaimed')} />
        <InfoRow
          value="Not Eligible"
          label={t('views.vesting.vestingStartTime')}
        />
        <InfoRow value="0 months" label={t('views.vesting.cliff')} />
        <InfoRow value="0 years" label={t('views.vesting.vestingPeriod')} />
        <InfoRow
          value={`${claimableAmount} THOR`}
          label={t('views.vesting.claimableAmount')}
        />

        <Box row justify="between" alignCenter mx={4} my={2}>
          <Typography variant="subtitle2" className="pr-4 min-w-fit">
            {t('views.vesting.claimAmount')}
          </Typography>

          <Input
            stretch
            onChange={(event) => setClaimAmount(event.target.value)}
            border="bottom"
            type="number"
            className="!text-right !text-base"
            value={claimAmount}
          />
        </Box>
        <Select
          className="!mx-8 justify-between"
          options={percentageOptions.map((option) => `${option}%`)}
          activeIndex={activeIndex}
          onChange={handlePercentagePress}
        />

        <Button stretch size="lg" className="mt-4">
          {t('common.connectWallet')}
        </Button>
      </Box>
    </PanelView>
  )
}

export default Vesting
