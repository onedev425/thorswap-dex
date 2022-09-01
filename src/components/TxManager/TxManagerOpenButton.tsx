import { Button, Icon, Tooltip } from 'components/Atomic';
import useWindowSize from 'hooks/useWindowSize';
import { t } from 'services/i18n';
import { TxTracker, TxTrackerStatus } from 'store/midgard/types';

type Props = {
  txData: TxTracker[];
};

export const TxManagerOpenButton = ({ txData }: Props) => {
  const hasHistory = !!txData.length;
  const pendingCount = txData.filter(
    (tx) => tx.status === TxTrackerStatus.Pending || tx.status === TxTrackerStatus.Submitting,
  ).length;
  const { isMdActive } = useWindowSize();

  return (
    <Tooltip content={getTooltipContent(hasHistory, pendingCount)}>
      <Button
        className="!px-2"
        disabled={!hasHistory}
        startIcon={
          pendingCount ? (
            <Icon spin name="loader" />
          ) : (
            <Icon name="menuFold" size={isMdActive ? 24 : 20} />
          )
        }
        type="borderless"
        variant="tint"
      />
    </Tooltip>
  );
};

const getTooltipContent = (hasHistory: boolean, pendingCount: number) => {
  if (pendingCount > 0) {
    return `${t('common.pendingTransactions')}:${'\u00A0\u00A0'}${pendingCount}`;
  }

  return hasHistory ? t('common.yourTransactions') : t('common.noTxHistory');
};
