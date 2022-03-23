import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import SocialIcons from 'components/SocialIcons'

export const AppPopoverMenu = () => {
  const { menus, menuType, onBack } = useAppPopoverMenu()

  return (
    <Popover
      trigger={
        <Button
          className="!px-2"
          type="borderless"
          variant="tint"
          startIcon={<Icon name="cog" />}
        />
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
