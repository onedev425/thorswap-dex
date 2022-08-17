import { memo, useMemo } from 'react'

import { SupportedChain } from '@thorswap-lib/types'
import classNames from 'classnames'

import { Box, Icon, IconName } from 'components/Atomic'

type ChainIconProps = {
  className?: string
  chain: SupportedChain
  size?: number
  style?: React.CSSProperties
}

export const ChainIcon = memo(
  ({ className, chain, style, size = 16 }: ChainIconProps) => {
    const chainIcon: IconName = useMemo(() => {
      const icon = chain.toLowerCase() as IconName

      switch (icon) {
        case 'eth':
          return 'ethereum'

        default:
          return icon
      }
    }, [chain])

    return (
      <Box
        className={classNames(
          'rounded-full bg-light-gray-light dark:bg-dark-gray-light',
          className,
        )}
        style={style}
      >
        <Icon className="p-0.5" name={chainIcon} size={size} />
      </Box>
    )
  },
)
