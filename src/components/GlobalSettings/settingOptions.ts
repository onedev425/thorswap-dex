import { FeeOption } from '@thorswap-lib/xchain-client'

import { t } from 'services/i18n'

export const slippageOptions = [
  {
    key: 'slip.min',
    value: 0.5,
    text: '0.5%',
  },
  {
    key: 'slip.med',
    value: 1,
    text: '1%',
  },
  {
    key: 'slip.max',
    value: 3,
    text: '3%',
  },
]

export const feeOptions = [
  {
    key: 'fee.average',
    type: FeeOption.Average,
    text: t('common.feeNormal'),
  },
  {
    key: 'fee.fast',
    type: FeeOption.Fast,
    text: t('common.feeFast'),
  },
  {
    key: 'fee.fastest',
    type: FeeOption.Fastest,
    text: t('common.feeInstant'),
  },
]
