import { TransactionStatus, TransactionType } from 'store/transactions/types'

import { t } from 'services/i18n'

export const transactionTitle = (type?: TransactionType) => {
  switch (type) {
    case 'approve':
      return t('txManager.approve')

    case 'swap':
    default:
      return t('txManager.swap')
  }
}

export const transactionBorderColors: Record<TransactionStatus, string> = {
  mined: 'border-btn-secondary dark:hover:!border-btn-secondary',
  pending: 'hover:border-btn-primary dark:hover:!border-btn-primary',
  refund: 'border-yellow dark:hover:!border-yellow',
  error: 'border-pink dark:hover:border-pink',
}

export const cutTxPrefix = (tx: string, prefix = '0x') =>
  tx?.startsWith(prefix) ? tx.slice(prefix.length) : tx
