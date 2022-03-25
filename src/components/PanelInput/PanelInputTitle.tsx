import { ReactNode } from 'react'

import { Typography } from 'components/Atomic'

type Props = {
  children: ReactNode
}

export const PanelInputTitle = ({ children }: Props) => {
  return (
    <Typography transform="uppercase" fontWeight="semibold">
      {children}
    </Typography>
  )
}
