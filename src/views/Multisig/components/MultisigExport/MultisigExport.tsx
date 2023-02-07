import { Button, Icon } from 'components/Atomic';
import { t } from 'services/i18n';
import { useMultisigExport } from 'views/Multisig/components/MultisigExport/hooks';

export const MultisigExport = () => {
  const { hasWallet, handleExport } = useMultisigExport();

  if (!hasWallet) {
    return null;
  }

  return (
    <Button
      onClick={handleExport}
      rightIcon={<Icon name="export" />}
      tooltip={t('views.multisig.exportTooltip')}
      variant="tint"
    >
      {t('views.multisig.export')}
    </Button>
  );
};
