import { ReactNode } from 'react'

import { Box } from 'components/Atomic'

type WalletOptionProps = {
  children: ReactNode
  onClick?: () => void
}

export const WalletOption = ({ children, ...rest }: WalletOptionProps) => {
  return (
    <Box
      className="w-full px-3 cursor-pointer h-14 rounded-xl bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110"
      alignCenter
      justify="between"
      row
      {...rest}
    >
      {children}
    </Box>
  )
}
