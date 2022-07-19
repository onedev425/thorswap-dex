import { useCallback } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { Box, Typography, Range, Button } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { InputAmount } from 'components/InputAmount'
import { getAmountFromString } from 'components/InputAmount/utils'

import { t } from 'services/i18n'

type Props = {
  onChange: (val: Amount) => void
  percent: Amount
}

export const WithdrawPercent = ({ onChange, percent }: Props) => {
  const handlePercentChange = useCallback(
    (value: Amount) => {
      const val = value.gt(100) ? Amount.fromNormalAmount(100) : value
      onChange(val)
    },
    [onChange],
  )

  const handleRange = (value: Amount) => {
    handlePercentChange(value)
  }

  return (
    <HighlightCard
      className="min-h-[107px] p-4 !mb-1 flex-row items-center justify-start"
      onClick={focus}
    >
      <Box className="w-full row-span-1 flex-row">
        <Box className="flex-1 items-center" alignCenter>
          <Typography className="inline-flex">
            {`${t('common.withdrawPercent')}:`}
          </Typography>
        </Box>

        <Box className="flex-1" alignCenter>
          <Box className="flex-1">
            <InputAmount
              stretch
              className="!text-2xl text-right mr-3"
              containerClassName="py-1"
              onAmountChange={handlePercentChange}
              amountValue={percent}
              suffix={<Typography variant="subtitle1">%</Typography>}
            />
          </Box>
        </Box>
      </Box>

      <Box
        className="flex-row pb-8 row-span-1 w-full sm:items-start md:items-center gap-x-6"
        alignCenter
        row
      >
        <Box className="w-11/12">
          <Range onAmountChange={handleRange} amountValue={percent} />
        </Box>

        <Box className="flex-auto" center row>
          <Button
            className="!h-5 !px-1.5"
            type="outline"
            variant="secondary"
            transform="uppercase"
            onClick={() =>
              handlePercentChange(getAmountFromString('100', 0) as Amount)
            }
          >
            {t('common.max')}
          </Button>
        </Box>
      </Box>
    </HighlightCard>
  )
}
