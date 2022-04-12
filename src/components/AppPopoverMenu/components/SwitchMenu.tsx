import { Box, SwitchToggle, Typography } from 'components/Atomic'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
}

export const SwitchMenu = ({ items }: Props) => {
  return (
    <Box className="w-full" col margin={2}>
      {items.map((item) => (
        <Box
          key={item.label}
          alignCenter
          marginBottom={2}
          className="px-5 py-4 dark:bg-btn-dark-tint rounded-2xl justify-between"
        >
          <Typography>{item.label}</Typography>
          <SwitchToggle
            checked={!!item.status}
            onChange={item.onClick as () => void}
          />
        </Box>
      ))}
    </Box>
  )
}
