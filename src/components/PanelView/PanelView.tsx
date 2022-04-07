import { ReactNode } from 'react'

import { Box, Card } from 'components/Atomic'
import { Helmet } from 'components/Helmet'

export type Props = {
  title: string
  header: ReactNode
  children: ReactNode
}

export const PanelView = ({ title, header, children }: Props) => {
  return (
    <Box className="self-center w-full max-w-[480px]" col>
      <Helmet title={title} content={title} />

      <Box className="w-full mx-2" col>
        {header}
      </Box>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
        stretch
      >
        {children}
      </Card>
    </Box>
  )
}
