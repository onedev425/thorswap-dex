import classNames from 'classnames'

import { Row } from 'components/Row'
import { Typography } from 'components/Typography'

import { InformationProps } from './types'

export const Information = (props: InformationProps) => {
  const { label, value, showBorder = true } = props
  const borderClasses =
    'border-0 border-b-2 border-dashed border-bottom border-light-typo-gray dark:border-dark-typo-gray'

  return (
    <Row
      className={classNames('pt-4 pb-3', {
        [borderClasses]: showBorder,
      })}
      align="center"
      justify="between"
    >
      <Typography variant="caption-xs" fontWeight="bold" color="secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography
          className="text-right"
          variant="caption-xs"
          fontWeight="bold"
          color="primary"
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Row>
  )
}
