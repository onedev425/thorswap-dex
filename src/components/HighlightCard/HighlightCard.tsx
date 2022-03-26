import { ReactNode } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import {
  borderHighlightClass,
  borderHoverHighlightClass,
} from 'components/constants'

type Props = {
  className?: string
  children: ReactNode
  isFocused?: boolean
  onClick?: () => void
  minHeight?: number
  disabled?: boolean
}

export const HighlightCard = ({
  className,
  disabled,
  children,
  isFocused,
  onClick,
}: Props) => {
  return (
    <Box
      col
      justify="between"
      className={classNames(
        'rounded-2xl md:rounded-3xl md:px-6 pb-3 md:py-4 md:gap-2 border border-solid border-transparent transition',
        'bg-light-gray-light dark:bg-dark-gray-light',
        {
          [borderHighlightClass]: isFocused,
          [borderHoverHighlightClass]: !disabled,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
