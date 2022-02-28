import { Box, Typography } from 'components/Atomic'

type WalletOptionProps = {
  title: string
  icon: React.ReactNode
  onClick?: () => void
}

export const WalletOption = ({ title, icon, ...rest }: WalletOptionProps) => {
  return (
    <Box
      className="w-full px-3 border border-solid cursor-pointer h-14 rounded-xl border-light-border-primary dark:border-dark-border-primary bg-light-dark-gray dark:bg-dark-dark-gray hover:brightness-110"
      alignCenter
      justify="between"
      row
      {...rest}
    >
      <Typography>{title}</Typography>
      {icon}
    </Box>
  )
}
