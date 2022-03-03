import classNames from 'classnames'

import { Row, Typography } from 'components/Atomic'

import { InformationProps } from './types'

export const Information = (props: InformationProps) => {
  const { label, value, showBorder = true } = props
  const borderClasses =
    'pb-1 border-0 border-b border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-50'

  return (
    <Row
      className={classNames({ [borderClasses]: showBorder })}
      align="center"
      justify="between"
    >
      <Typography variant="caption" fontWeight="medium" color="secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography
          className="text-right"
          variant="caption-xs"
          fontWeight="semibold"
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
