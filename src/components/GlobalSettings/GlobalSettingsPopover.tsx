import { Button, Icon } from 'components/Atomic'
import { GlobalSettings } from 'components/GlobalSettings'
import { Popover } from 'components/Popover'

import { t } from 'services/i18n'

type Props = {
  transactionMode?: boolean
}

export const GlobalSettingsPopover = ({ transactionMode }: Props) => {
  return (
    <Popover
      trigger={
        <Button
          className="px-1.5 group"
          type="borderless"
          variant="tint"
          startIcon={
            <Icon
              className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
              color="secondary"
              name="cog"
            />
          }
          tooltip={t('common.settings')}
          tooltipPlacement="top"
        />
      }
    >
      <GlobalSettings transactionMode={transactionMode} />
    </Popover>
  )
}
