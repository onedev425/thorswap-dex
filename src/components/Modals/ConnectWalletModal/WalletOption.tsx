import { memo, useCallback } from 'react'

import classNames from 'classnames'

import { Box, Icon, IconName, Typography } from 'components/Atomic'

import { WalletType } from './types'

type Props = {
  label: string
  icon: IconName
  type: WalletType
  onClick?: () => void
  handleTypeSelect: (type: WalletType) => void
  selected: boolean
  disabled?: boolean
  connected?: boolean
}

const WalletOption = ({
  label,
  icon,
  connected,
  handleTypeSelect,
  type,
  selected,
  disabled,
}: Props) => {
  const handleClick = useCallback(() => {
    if (!disabled) handleTypeSelect(type)
  }, [disabled, handleTypeSelect, type])

  return (
    <Box
      onClick={handleClick}
      alignCenter
      justify="between"
      className={classNames(
        'cursor-pointer relative bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110',
        'w-fit h-10 rounded-xl m-1 gap-x-2 px-2',
        {
          '!bg-cyan !bg-opacity-20': selected,
          'opacity-40 cursor-not-allowed': disabled,
        },
      )}
    >
      <Box
        className={classNames(
          'opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary',
          'absolute -top-2 -right-1 p-0.5 rounded-xl',
          'border border-solid border-cyan',
          { '!opacity-100': selected },
        )}
      >
        <Icon name="connect" size={14} color="cyan" />
      </Box>

      <Box
        className={classNames(
          'opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary',
          'absolute -top-2 -left-1 p-0.5 rounded-xl',
          'border border-solid border-green',
          { '!opacity-100': connected },
        )}
      >
        <Icon name="connect" size={14} color="green" />
      </Box>

      <Icon name={icon} size={24} />

      <Typography variant="caption" className="text-center">
        {label}
      </Typography>
    </Box>
  )
}

export default memo(WalletOption)
