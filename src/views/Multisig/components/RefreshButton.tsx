import { Tooltip } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'

import { useMultisig } from 'store/multisig/hooks'
import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'

export const RefreshButton = () => {
  const { loadBalances } = useMultisig()
  const loadingBalances = useAppSelector(
    (state) => !!state.multisig.loadingBalances,
  )

  return (
    <Tooltip className="h-fit" content={t('common.refresh')}>
      <HoverIcon
        iconName="refresh"
        onClick={loadBalances}
        spin={loadingBalances}
        size={19}
      />
    </Tooltip>
  )
}
