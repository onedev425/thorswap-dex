import { getSimpleTxStatus } from 'components/TransactionManager/helpers';
import dayjs from 'dayjs';
import { t } from 'services/i18n';
import { TransactionStatus, TxStatus, TxTrackerLeg } from 'store/transactions/types';

export const getTxDisplayStatus = (status?: TxStatus) => {
  return status ? getSimpleTxStatus(status) : 'unknown';
};

export const getTxStatusColor = (status: TransactionStatus | null) => {
  switch (status) {
    case 'mined':
      return 'brand.green';
    case 'error':
      return 'brand.red';
    case 'pending':
      return 'brand.btnPrimary';
    case 'refund':
      return 'brand.yellow';
    default:
      return 'brand.tintHover';
  }
};

export const getTxStatusLabel = (status: TransactionStatus | null) => {
  switch (status) {
    case 'mined':
      return t('txManager.success');
    case 'error':
      return t('txManager.failed');
    case 'pending':
    case 'notStarted':
      return t('txManager.pending');
    case 'unknown':
      return t('txManager.unknown');
    case 'refund':
      return t('txManager.refunded');
    default:
      return t('txManager.unknown');
  }
};

export const getTxState = (status?: TxStatus) => {
  if (!status) return { completed: false, error: false, finished: false };

  const error = status === TxStatus.ERROR || status === TxStatus.CANCELLED;
  const completed =
    status === TxStatus.SUCCESS || status === TxStatus.REFUNDED || status === TxStatus.REPLACED;
  const finished = completed || error;

  return { completed, error, finished };
};

type DurationFormatConfig = { noUnits?: boolean; approx?: boolean };

export const getDurationFormat = (durationMs: number, config?: DurationFormatConfig) => {
  const longerThanHour = durationMs >= 3600000;

  if (!longerThanHour) {
    return config?.noUnits ? 'mm:ss' : 'mm[m] ss[s]';
  }

  if (config?.approx) {
    return config?.noUnits ? 'HH:mm' : 'HH[h] mm[m]';
  }

  return config?.noUnits ? 'HH:mm:ss' : 'HH[h] mm[m] ss[s]';
};

export const formatDuration = (
  durationMs: number,
  config?: { noUnits?: boolean; approx?: boolean },
) => {
  let format = getDurationFormat(durationMs, config);

  return dayjs.duration(durationMs, 'ms').format(format);
};

export const getTxDuration = (legs: TxTrackerLeg[]) => {
  const startTimestamp = legs[0]?.startTimestamp;
  const endTimestamp = legs[legs.length - 1]?.endTimestamp;

  if (!endTimestamp || !startTimestamp) {
    return null;
  }

  return endTimestamp - startTimestamp;
};
