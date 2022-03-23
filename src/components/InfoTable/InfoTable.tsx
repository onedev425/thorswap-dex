import { Box } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { InfoTableProps } from 'components/InfoTable/types'

export const InfoTable = ({
  items,
  size = 'md',
  showBorder,
}: InfoTableProps) => {
  return (
    <Box col>
      {items.map((item) => (
        <InfoRow
          key={item.label}
          label={item.label}
          value={item.value}
          size={size}
          showBorder={showBorder}
        />
      ))}
    </Box>
  )
}
