import { memo } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { InfoRowConfig, InfoRowSize } from 'components/InfoRow/types'

type InfoTableProps = {
  items: InfoRowConfig[]
  size?: InfoRowSize
  horizontalInset?: boolean
  className?: string
}

export const InfoTable = memo(
  ({
    items,
    size: rowSize = 'md',
    horizontalInset,
    className,
  }: InfoTableProps) => {
    return (
      <Box
        col
        className={classNames(
          'self-stretch flex-1',
          { 'px-1.5': horizontalInset },
          className,
        )}
      >
        {items.map(
          ({ className, label, key, size, value, onClick }, index, array) => {
            const rowKey = key
              ? key
              : typeof label === 'string'
              ? label?.toString()
              : typeof value === 'string'
              ? value
              : 'not-a-proper-key'

            return (
              <InfoRow
                onClick={onClick}
                className={classNames(className, {
                  'cursor-pointer': !!onClick,
                })}
                key={rowKey}
                label={label}
                value={value}
                size={size || rowSize}
                showBorder={array.length - 1 > index}
              />
            )
          },
        )}
      </Box>
    )
  },
)
