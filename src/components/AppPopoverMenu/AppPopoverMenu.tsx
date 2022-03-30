import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import SocialIcons from 'components/SocialIcons'

import { t } from 'services/i18n'

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
          tooltip={t('common.globalSettings')}
        />
      }
      onClose={onBack}
    >
      <Card
        className="mt-2 min-w-[160px] sm:w-[420px] border border-solid border-btn-primary"
        size="sm"
      >
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
