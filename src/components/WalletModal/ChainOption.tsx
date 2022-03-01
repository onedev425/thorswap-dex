import { Box } from 'components/Atomic'

type ChainOptionProps = {
  children: React.ReactNode
  onClick?: () => void
}

export const ChainOption = ({ children, ...rest }: ChainOptionProps) => {
  return (
    <Box
      className="w-full px-3 cursor-pointer h-14 rounded-xl bg-light-dark-gray dark:bg-dark-dark-gray hover:brightness-90 dark:hover:brightness-110"
      alignCenter
      justify="between"
      row
      {...rest}
    >
      {children}
    </Box>
  )
}
