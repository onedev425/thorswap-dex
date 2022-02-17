import { useState } from 'react'

import classNames from 'classnames'

import { Row } from 'components/Row'
import { Typography } from 'components/Typography'

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
      <Row marginBottom="16px">
        {typeof title === 'string' ? (
          <Typography variant="h3" fontWeight="extrabold">
            {title}
          </Typography>
        ) : (
          title
        )}
      </Row>
      <Row className="gap-x-1" align="start">
        <Typography variant="h1">{amount}</Typography>
        <Typography color={prevChange ? 'green' : 'red'} fontWeight="semibold">
          {prevChange ? '+' : '-'}
          {percentage ? `${Math.abs(change)}%` : `$${Math.abs(change)}`}
        </Typography>
        <Typography color="secondary" fontWeight="semibold">
          {`($${value})`}
        </Typography>
      </Row>
    </div>
  )
}
