import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'
import { InfoRowProps } from 'components/InfoRow/types'

const labelVariant = {
  sm: 'caption-xs',
  md: 'caption',
  lg: 'body',
} as const
const valueVariant = { sm: 'caption-xs', md: 'caption', lg: 'body' } as const
const heightVariant = {
  sm: 'min-h-[30px]',
  md: 'min-h-[43px]',
  lg: 'min-h-[52px]',
} as const

export const InfoRow = ({
  label,
  value,
  className,
  size = 'md',
  showBorder = true,
}: InfoRowProps) => {
  const borderClasses =
    'border-0 border-b border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20'

  return (
    <Box
      className={classNames(
        'gap-4',
        { [borderClasses]: showBorder },
        heightVariant[size],
        className,
      )}
      alignCenter
      justify="between"
    >
      {typeof label === 'string' ? (
        <Typography
          variant={labelVariant[size]}
          fontWeight="medium"
          color="secondary"
        >
          {label}
        </Typography>
      ) : (
        label
      )}

      {typeof value === 'string' || typeof value === 'number' ? (
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
