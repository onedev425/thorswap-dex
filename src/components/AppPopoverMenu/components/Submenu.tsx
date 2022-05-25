import { Box } from 'components/Atomic'
import { MenuItem } from 'components/Menu/MenuItem'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
}

export const Submenu = ({ items }: Props) => {
  return (
    <Box flex={1} col mt={16}>
      {items.map((item) => (
        <MenuItem
          key={typeof item.label === 'string' ? item.label : item.key}
          {...item}
        />
      ))}
    </Box>
  )
}
