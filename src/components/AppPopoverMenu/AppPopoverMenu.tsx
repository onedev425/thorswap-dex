import { AppMenu } from 'components/AppPopoverMenu/AppMenu'
import { Button, Icon } from 'components/Atomic'
import { Popover } from 'components/Popover'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

export const AppPopoverMenu = () => {
  const { isMdActive } = useWindowSize()

  return (
    <Popover
      trigger={
        <Button
          className="!px-2"
          type="borderless"
          variant="tint"
          startIcon={<Icon name="cog" size={isMdActive ? 24 : 20} />}
          tooltip={t('common.globalSettings')}
        />
      }
    >
      <AppMenu />
    </Popover>
  )
}
