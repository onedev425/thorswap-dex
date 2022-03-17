import { useState } from 'react'

import { Card, Box, Icon, Typography, Select, Button } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Information } from 'components/Information'
import { Input } from 'components/Input'
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
    <Box className="self-center w-full max-w-[600px]" col>
      <Helmet title="Liquidity" content="Your Liquidity" />
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('views.vesting.linearVesting')}
          actionsComponent={<Icon name="refresh" color="secondary" />}
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="flex-col items-center md:w-full mt-4 md:mt-8 md:h-auto shadow-lg"
      >
        <Box className="w-full gap-5" col>
          <Information
            size="lg"
            value="N/A"
            label={t('views.vesting.totalVested')}
          />
          <Information
            size="lg"
            value="N/A"
            label={t('views.vesting.totalClaimed')}
          />
          <Information
            size="lg"
            value="Not Eligible"
            label={t('views.vesting.vestingStartTime')}
          />
          <Information
            size="lg"
            value="0 months"
            label={t('views.vesting.cliff')}
          />
          <Information
            size="lg"
            value="0 years"
            label={t('views.vesting.vestingPeriod')}
          />
          <Information
            size="lg"
            value={`${claimableAmount} THOR`}
            label={t('views.vesting.claimableAmount')}
          />

          <Box row justify="between" alignCenter mx={4} my={2}>
            <Typography variant="subtitle2" className="min-w-fit pr-4">
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
      </Card>
    </Box>
  )
}

export default Vesting
