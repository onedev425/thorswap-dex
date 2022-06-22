import { memo } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { InfoRowConfig, InfoRowSize } from 'components/InfoRow/types'

type InfoTableProps = {
  items: InfoRowConfig[]
  size?: InfoRowSize
  showBorder?: boolean
  horizontalInset?: boolean
  className?: string
}

export const InfoTable = memo(
  ({
    items,
    size: rowSize = 'md',
    showBorder,
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
        {items.map(({ className, label, key, size, value }) => {
          const rowKey = key
            ? key
            : typeof label === 'string'
            ? label?.toString()
            : typeof value === 'string'
            ? value
            : 'not-a-proper-key'

          return (
            <InfoRow
              className={className}
              key={rowKey}
              label={label}
              value={value}
              size={size || rowSize}
              showBorder={showBorder}
            />
          )
        })}
      </Box>
    )
  },
)
