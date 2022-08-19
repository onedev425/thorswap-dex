import { memo, PropsWithChildren } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'

type Props = PropsWithChildren<{ className?: string }>

export const TransactionContainer = memo(({ children, className }: Props) => {
  return (
    <Box
      className={classNames(
        'first:!mt-0 mt-1 px-2 py-1.5 dark:bg-dark-border-primary rounded-md border border-solid border-transparent transition',
        className,
      )}
      row
      alignCenter
    >
      {children}
    </Box>
  )
})
