import classNames from 'classnames'

import { Box } from 'components/Atomic'

type ChainOptionProps = {
  isSelected: boolean
  children: React.ReactNode
  onClick?: () => void
}

export const ChainOption = ({
  isSelected,
  children,
  ...rest
}: ChainOptionProps) => {
  return (
    <Box
      className={classNames(
        'border border-solid w-full px-3 cursor-pointer h-14 rounded-xl bg-light-dark-gray dark:bg-dark-dark-gray hover:brightness-90 dark:hover:brightness-110',
        isSelected ? 'border-btn-primary' : 'border-transparent',
      )}
      alignCenter
      justify="between"
      row
      {...rest}
    >
      {children}
    </Box>
  )
}
