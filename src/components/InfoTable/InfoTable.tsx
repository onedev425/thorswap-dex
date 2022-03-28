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

export const InfoTable = ({
  items,
  size = 'md',
  showBorder,
  horizontalInset,
  className,
}: InfoTableProps) => {
  return (
    <Box
      className={classNames(
        'self-stretch flex-1',
        { 'px-1.5': horizontalInset },
        className,
      )}
      col
    >
      {items.map((item) => (
        <InfoRow
          key={item.label}
          label={item.label}
          value={item.value}
          size={item.size || size}
          showBorder={showBorder}
        />
      ))}
    </Box>
  )
}
