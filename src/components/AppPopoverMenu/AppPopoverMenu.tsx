import { AppMenu } from 'components/AppPopoverMenu/AppMenu'
import { Button, Icon } from 'components/Atomic'
import { Popover } from 'components/Popover'

import { t } from 'services/i18n'

export const AppPopoverMenu = () => {
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
    >
      <AppMenu />
    </Popover>
  )
}
