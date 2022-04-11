import { BUILD_NUMBER } from 'config/constants'

import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { SwitchMenu } from 'components/AppPopoverMenu/components/SwitchMenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import SocialIcons from 'components/SocialIcons'

import { t } from 'services/i18n'

import packageJson from '../../../package.json'

export const AppPopoverMenu = () => {
  const { menus, menuType, onBack } = useAppPopoverMenu()
  const renderMenu = () => {
    switch (menuType) {
      case 'main':
        return (
          <Box className="gap-4" col>
            <MainMenu items={menus.main.items} />
            <SocialIcons />
          </Box>
        )
      case 'settings':
        return <SwitchMenu items={menus.settings.items} />
      default:
        return <Submenu items={menus[menuType].items} />
    }
  }
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
        size="sm"
        className="flex-col mt-2 pr-6 min-w-[160px] sm:w-[420px] border border-solid border-btn-primary"
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
        </Box>
        {renderMenu()}
        <Box justify="end">
          <Typography variant="caption-xs" color="secondary">
            {`v${packageJson.version} (${BUILD_NUMBER})`}
          </Typography>
        </Box>
      </Card>
    </Popover>
  )
}
