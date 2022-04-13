import { Box } from 'components/Atomic'
import { MenuItem } from 'components/Menu/MenuItem'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
}

export const Submenu = ({ items }: Props) => {
  return (
    <Box col mt={16}>
      {items.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
    </Box>
  )
}
