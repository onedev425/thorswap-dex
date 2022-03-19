import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import SocialIcons from 'components/SocialIcons'

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
      onClose={onBack}
    >
      <Card className="mt-2 w-[90%] sm:w-[420px] border border-solid border-btn-primary">
        <Box className="w-full" col margin={2}>
          <Box row alignCenter>
            {menuType !== 'main' && (
              <Box
                onClick={onBack}
                className="p-2.5 !mr-2 rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active cursor-pointer"
                center
              >
                <Icon name="chevronLeft" />
              </Box>
            )}
            <Typography variant="subtitle2">{menus[menuType].title}</Typography>
          </Box>

          {menuType === 'main' ? (
            <Box className="gap-4" col>
              <MainMenu items={menus.main.items} />
              <SocialIcons />
            </Box>
          ) : (
            <Submenu items={menus[menuType].items} />
          )}
        </Box>
      </Card>
    </Popover>
  )
}
