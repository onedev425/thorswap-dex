import { Amount } from '@thorswap-lib/multichain-sdk'

import { InputProps } from 'components/Input/types'

export type InputAmountProps = InputProps & {
  amountValue: Amount | undefined
  onAmountChange?: (value: Amount) => void
}
