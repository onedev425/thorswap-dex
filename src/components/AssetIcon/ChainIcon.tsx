import { memo } from 'react'

import classNames from 'classnames'

import { Box, Icon, IconName } from 'components/Atomic'

import { ChainIconProps } from './types'

export const ChainIcon = memo(
  ({ className, chain, size = 16 }: ChainIconProps) => {
    const chainIcon = chain.toLowerCase()

    return (
      <Box
        className={classNames(
          'rounded-full bg-light-gray-light dark:bg-dark-gray-light',
          className,
        )}
        alignCenter
        justifyCenter
        style={{ width: size, height: size }}
      >
        <Icon name={chainIcon as IconName} size={size * 0.75} />
      </Box>
    )
  },
)
