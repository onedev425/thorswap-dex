import { ReactNode } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import {
  borderHighlightClass,
  borderHoverHighlightClass,
} from 'components/constants'
import { CardStyleType } from 'components/HighlightCard/types'

type Props = {
  className?: string
  children: ReactNode
  isFocused?: boolean
  onClick?: () => void
  minHeight?: number
  disabled?: boolean
  type?: CardStyleType
}

export const HighlightCard = ({
  className,
  disabled,
  children,
  isFocused,
  type = 'info',
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
          'border-yellow hover:!border-yellow border-opacity-50 hover:border-opacity-100 !bg-yellow !bg-opacity-10':
            type === 'warn',
        },

        className,
      )}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
