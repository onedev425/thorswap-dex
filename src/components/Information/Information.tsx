import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'

type InformationProps = {
  className?: string
  label: string
  value: string | React.ReactNode
  showBorder?: boolean
}

export const Information = ({
  label,
  value,
  className,
  showBorder = true,
}: InformationProps) => {
  const borderClasses =
    'pb-1 border-0 border-b border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-50'

  return (
    <Box
      row
      className={classNames(className, { [borderClasses]: showBorder })}
      alignCenter
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
    </Box>
  )
}
