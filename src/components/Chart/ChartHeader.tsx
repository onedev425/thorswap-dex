import { memo } from 'react'

import { Typography, Box } from 'components/Atomic'

import { abbreviateNumber } from 'helpers/number'

type Props = {
  title: string
  values: number[]
}

export const ChartHeader = memo(({ values, title }: Props) => {
  const changePercentage =
    values.length >= 2
      ? (values[values.length - 1] / values[values.length - 2]) * 100 - 100
      : 0

  return (
    <Box className="space-x-2" row>
      <Typography variant="h3">
        {title}

        <span className="text-btn-primary">
          {` ${abbreviateNumber(values?.[values.length - 1] ?? 0, 2)}`}
        </span>
      </Typography>

      <Box className="hidden lg:flex gap-x-1" row alignCenter>
        <Typography
          color={changePercentage >= 0 ? 'green' : 'red'}
          fontWeight="semibold"
        >
          ({changePercentage >= 0 ? '+' : '-'}
          {changePercentage
            ? `${Math.abs(changePercentage).toFixed(2)}%`
            : `$${Math.abs(changePercentage).toFixed(2)}`}
          )
        </Typography>
      </Box>
    </Box>
  )
})
