import { TxTrackerType } from 'store/midgard/types'

import { t } from 'services/i18n'

import { TypographyColorType } from './../Atomic/Typography/types'

export const txType: Record<TxTrackerType, string> = {
  [TxTrackerType.Send]: 'Send', // TODO: i18n
  [TxTrackerType.Approve]: t('txManager.approve'),
  [TxTrackerType.Swap]: t('txManager.swap'),
  [TxTrackerType.AddLiquidity]: t('txManager.addLiquidity'),
  [TxTrackerType.Withdraw]: t('txManager.withdraw'),
  [TxTrackerType.Donate]: t('txManager.donate'),
  [TxTrackerType.Refund]: t('txManager.refund'),
  [TxTrackerType.Switch]: t('txManager.switch'),
  [TxTrackerType.Mint]: t('txManager.mint'),
  [TxTrackerType.Redeem]: t('txManager.redeem'),
}

export type TxProgressStatus = 'success' | 'pending' | 'refunded' | 'failed'

export const txProgressColors: Record<TxProgressStatus, TypographyColorType> = {
  success: 'secondaryBtn',
  pending: 'primaryBtn',
  refunded: 'yellow',
  failed: 'pink',
}

export const txProgressBorderColors: Record<TxProgressStatus, string> = {
  success: '!hover:border-btn-secondary dark:hover:!border-btn-secondary',
  pending: '!hover:border-btn-primary dark:hover:!border-btn-primary',
  refunded: '!hover:border-yellow dark:hover:!border-yellow',
  failed: 'hover:border-pink dark:hover:border-pink',
}

export const txProgressBorderActiveColors: Record<TxProgressStatus, string> = {
  success: '!border-btn-secondary dark:!border-btn-secondary',
  pending: '!border-btn-primary dark:!border-btn-primary',
  refunded: '!border-yellow dark:!border-yellow',
  failed: '!border-pink !hover:border-pink',
}
