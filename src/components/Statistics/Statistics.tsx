import { useState } from 'react'

import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'

import { StatisticsType } from './types'

export const Statistics = ({
  amount,
  change,
  className,
  percentage,
  title,
  value,
}: StatisticsType) => {
  const [prevChange, setPreviousChange] = useState(false)

  if (prevChange !== change >= 0) {
    setPreviousChange(change >= 0)
  }

  return (
    <div className={classNames(className)}>
      <Box mb={2}>
        {typeof title === 'string' ? (
          <Typography variant="h5" fontWeight="extrabold">
            {title}
          </Typography>
        ) : (
          title
        )}
      </Box>
      <Box className="gap-x-1" row alignCenter>
        <Typography variant="h2">{amount}</Typography>
        <Typography color={prevChange ? 'green' : 'red'} fontWeight="semibold">
          {prevChange ? '+' : '-'}
          {percentage ? `${Math.abs(change)}%` : `$${Math.abs(change)}`}
        </Typography>
        <Typography color="secondary" fontWeight="semibold">
          {`($${value})`}
        </Typography>
      </Box>
    </div>
  )
}
