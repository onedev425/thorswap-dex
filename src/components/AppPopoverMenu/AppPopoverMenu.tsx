import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'

export const AppPopoverMenu = () => {
  const { menus, menuType, onBack } = useAppPopoverMenu()

  return (
    <Popover
      trigger={
        <Box
          className="p-2 cursor-pointer rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active"
          alignCenter
          justifyCenter
        >
          <Icon name="cog" />
        </Box>
      }
    >
      <Card className="mt-2 w-[90%] sm:w-[420px] border border-solid border-btn-primary">
        <Box className="w-full" col margin={2}>
          <Box row alignCenter>
            {menuType !== 'main' && (
              <Icon className="mr-2" name="chevronLeft" onClick={onBack} />
            )}
            <Typography variant="subtitle2">{menus[menuType].title}</Typography>
          </Box>

          {menuType === 'main' ? (
            <MainMenu items={menus.main.items} />
          ) : (
            <Submenu items={menus[menuType].items} />
          )}
        </Box>
      </Card>
    </Popover>
  )
}
