import { Tooltip } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { t } from 'services/i18n';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';

export const RefreshButton = () => {
  const { loadBalances } = useMultisig();
  const loadingBalances = useAppSelector((state) => !!state.multisig.loadingBalances);

  return (
    <Tooltip className="h-fit" content={t('common.refresh')}>
      <HoverIcon iconName="refresh" onClick={loadBalances} size={19} spin={loadingBalances} />
    </Tooltip>
  );
};
