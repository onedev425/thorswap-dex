import { Box, Icon, Typography } from 'components/Atomic'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
}

export const MainMenu = ({ items }: Props) => {
  return (
    <Box className="grid grid-cols-2 gap-1 mt-3">
      {items.map((item) => (
        <Box
          key={item.label}
          className={
            'p-4 cursor-pointer rounded-2xl bg-light-bg-primary dark:bg-dark-gray-light hover:brightness-95 dark:hover:brightness-125 transition-colors'
          }
          col
          onClick={item.onClick}
        >
          <Box row justify="between">
            {item.icon && !item.iconComponent && <Icon name={item.icon} />}
            {!!item.iconComponent && item.iconComponent}
            <Icon name="chevronRight" />
          </Box>

          <Typography className="mt-4">{item.label}</Typography>
          <Typography variant="caption-xs" color="secondary">
            {item.desc}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
