// import classNames from 'classnames'

import { useAppPopovermenu } from 'components/AppPopoverMenu/useAppPopovermenu'
import { Box, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'

import { t } from 'services/i18n'

export const AppPopoverMenu = () => {
  const { menus, menuType, onBack } = useAppPopovermenu()

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
            <Typography variant="subtitle2">{t('common.settings')}</Typography>
          </Box>
          <Box className="grid grid-cols-2 gap-1" mt={3}>
            {menus[menuType].map((menu) => (
              <Box
                key={menu.label}
                className="p-4 cursor-pointer rounded-2xl bg-light-gray-light dark:bg-dark-gray-light"
                col
                onClick={menu.onClick}
              >
                <Box row justify="between">
                  {menu.icon && <Icon name={menu.icon} />}
                  <Icon name="chevronRight" />
                </Box>
                <Typography className="mt-4">{menu.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Popover>
  )
}
