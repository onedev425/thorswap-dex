import classNames from 'classnames'

import { Row } from '../Row'
import { Typography } from '../Typography'
import { InformationProps } from './types'

export const Information = (props: InformationProps) => {
  const { label, value, showBorder = true } = props
  const borderClasses =
    'border-0 border-b-2 border-dashed border-bottom border-gray'

  return (
    <Row
      className={classNames('justify-between m-0 px-2 py-4', {
        [borderClasses]: showBorder,
      })}
      align="center"
    >
      <Typography variant="body" fontWeight="bold" color="secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography
          variant="body"
          fontWeight="bold"
          color="secondary"
          className=" text-right"
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Row>
  )
}
