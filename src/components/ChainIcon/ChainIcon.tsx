import classNames from 'classnames'

import { Box, Icon, IconName } from 'components/Atomic'

import { Props } from './types'

export const ChainIcon = ({ className, chain, size = 16 }: Props) => {
  const chainIcon = chain.toLowerCase()

  return (
    <Box
      className={classNames(
        'rounded-full bg-light-gray-light dark:bg-dark-gray-light',
        className,
      )}
      alignCenter
      justifyCenter
      width={size}
      height={size}
    >
      <Icon name={chainIcon as IconName} size={(size / 4) * 3} />
    </Box>
  )
}
