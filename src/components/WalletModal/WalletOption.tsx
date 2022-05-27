import { memo, useCallback } from 'react'

import classNames from 'classnames'

import { Box, Icon, IconName, Typography } from 'components/Atomic'
import { WalletType } from 'components/WalletModal/types'

type Props = {
  label: string
  icon: IconName
  type: WalletType
  onClick?: () => void
  handleTypeSelect: (type: WalletType) => void
}

export const WalletOption = memo(
  ({ label, icon, handleTypeSelect, type }: Props) => {
    const handleClick = useCallback(() => {
      handleTypeSelect(type)
    }, [handleTypeSelect, type])

    return (
      <Box
        col
        onClick={handleClick}
        alignCenter
        justify="between"
        className={classNames(
          'cursor-pointer bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110',
          'pt-3 w-28 md:w-32 h-24 md:h-[84px] rounded-xl',
        )}
      >
        <Icon name={icon} size={26} />

        <Box flex={1} center className="px-2">
          <Typography variant="caption" className="text-center">
            {label}
          </Typography>
        </Box>
      </Box>
    )
  },
)
