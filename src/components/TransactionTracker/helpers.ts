import { TxStatus } from '@swapkit/api';
import { getSimpleTxStatus } from 'components/TransactionManager/helpers';
import dayjs from 'dayjs';
import { t } from 'services/i18n';
import type { TransactionStatus, TxTrackerLeg } from 'store/transactions/types';

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
  if (!status) return { completed: false, error: false, finished: false, timedOut: false };

  const error = status === TxStatus.ERROR || status === TxStatus.CANCELLED;
  const completed =
    status === TxStatus.SUCCESS || status === TxStatus.REFUNDED || status === TxStatus.REPLACED;
  const timedOut = status === TxStatus.RETRIES_EXCEEDED;
  const finished = completed || error || timedOut;

  return { completed, error, finished, timedOut };
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

export const getDaysRestDurationFormat = (config?: DurationFormatConfig) => {
  if (config?.approx) {
    return config?.noUnits ? 'HH' : 'HH[h]';
  }

  return config?.noUnits ? 'HH:mm' : 'HH[h] mm[m]';
};

export const formatDuration = (
  durationMs: number,
  config?: { noUnits?: boolean; approx?: boolean },
) => {
  const days = Math.floor(durationMs / 86400000);
  const rest = durationMs % 86400000;

  if (days > 0) {
    const daysFormat = days > 1 ? t('common.days') : t('common.day');
    const daysLabel = days > 0 ? `${days} ${daysFormat} ` : '';

    return `${daysLabel} ${dayjs.duration(rest, 'ms').format(getDaysRestDurationFormat(config))}`;
  }

  const format = getDurationFormat(durationMs, config);
  return dayjs.duration(rest, 'ms').format(format);
};

export const getTxDuration = (legs: TxTrackerLeg[]) => {
  const startTimestamp = legs[0]?.startTimestamp;
  const endTimestamp = legs[legs.length - 1]?.endTimestamp;

  if (!endTimestamp || !startTimestamp) {
    return null;
  }

  return endTimestamp - startTimestamp;
};
