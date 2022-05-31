import { memo } from 'react'

import { Box, Typography } from 'components/Atomic'

import { abbreviateNumber } from 'helpers/number'

type Props = {
  title: string
  values: number[]
  unit: string
}

export const ChartHeader = memo(({ unit, values, title }: Props) => {
  const changePercentage =
    values.length >= 2
      ? (values[values.length - 1] / values[values.length - 2]) * 100 - 100
      : 0

  return (
    <Box alignCenter justify="start" className="lg:flex-row">
      <Typography component="span" variant="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">
          {` ${unit}${abbreviateNumber(values?.[values.length - 1] ?? 0, 2)} `}
        </span>

        <Typography
          component="span"
          className="mb-1"
          color={changePercentage >= 0 ? 'green' : 'red'}
          fontWeight="semibold"
        >
          ({changePercentage >= 0 ? '+' : '-'}
          {changePercentage
            ? `${Math.abs(changePercentage).toFixed(2)}%`
            : `$${Math.abs(changePercentage).toFixed(2)}`}
          )
        </Typography>
      </Typography>
    </Box>
  )
})
