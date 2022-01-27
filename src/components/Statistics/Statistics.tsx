import { Row } from 'components/Row'
import { Typography } from 'components/Typography'

import { StatisticsType } from './types'

export const Statistics = (props: StatisticsType) => {
  const { title, amount, change, value } = props

  return (
    <div>
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
        <Typography color={change >= 0 ? 'green' : 'red'} fontWeight="semibold">
          {change !== 0 && (change > 0 ? '+' : '-')}${Math.abs(change)}
        </Typography>
        <Typography color="secondary" fontWeight="semibold">
          (${value})
        </Typography>
      </Row>
    </div>
  )
}
