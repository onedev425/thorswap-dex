import { Button, Icon, Tooltip } from 'components/Atomic'

import { TxTracker, TxTrackerStatus } from 'redux/midgard/types'

import { t } from 'services/i18n'

type Props = {
  txData: TxTracker[]
}

export const TxManagerOpenButton = ({ txData }: Props) => {
  const hasHistory = !!txData.length
  const pendingCount = txData.filter(
    (tx) => tx.status === TxTrackerStatus.Pending,
  ).length

  return (
    <Tooltip content={getTooltipContent(hasHistory, pendingCount)}>
      <Button
        className="!px-2"
        type="borderless"
        variant="tint"
        startIcon={
          pendingCount ? <Icon name="loader" spin /> : <Icon name="menuFold" />
        }
        disabled={!hasHistory}
      />
    </Tooltip>
  )
}

const getTooltipContent = (hasHistory: boolean, pendingCount: number) => {
  if (pendingCount > 0) {
    return `${t('common.pendingTransactions')}:${'\u00A0\u00A0'}${pendingCount}`
  }

  return hasHistory ? t('common.yourTransactions') : t('common.noTxHistory')
}
