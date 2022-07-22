import { useMultisigExport } from 'views/Multisig/components/MultisigExport/hooks'

import { Button, Icon } from 'components/Atomic'

import { t } from 'services/i18n'

export const MultisigExport = () => {
  const { hasWallet, handleExport } = useMultisigExport()

  if (!hasWallet) {
    return null
  }

  return (
    <Button
      variant="tint"
      onClick={handleExport}
      endIcon={<Icon name="export" />}
      tooltip={t('views.multisig.exportTooltip')}
    >
      {t('views.multisig.export')}
    </Button>
  )
}
