import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'

type InformationProps = {
  className?: string
  label: string
  value: string | React.ReactNode
  showBorder?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const labelVariant = {
  sm: 'caption-xs',
  md: 'caption',
  lg: 'body',
} as const
const valueVariant = { sm: 'caption-xs', md: 'caption-xs', lg: 'body' } as const

export const Information = ({
  label,
  value,
  className,
  size = 'md',
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
      <Typography
        variant={labelVariant[size]}
        fontWeight="medium"
        color="secondary"
      >
        {label}
      </Typography>

      {typeof value === 'string' ? (
        <Typography
          className="text-right"
          variant={valueVariant[size]}
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
