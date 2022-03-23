/* eslint-disable react-hooks/rules-of-hooks */
import { Amount } from '@thorswap-lib/multichain-sdk'
import BigNumber from 'bignumber.js'

import { useApp } from 'redux/app/hooks'

const useGroupSeparator = () => {
  const { thousandSeparator } = useApp()

  switch (thousandSeparator) {
    case 'comma':
      return ','

    case 'space':
      return ' '

    default:
      return ''
  }
}

const getNumberOfDecimals = (amount: Amount | number) => {
  const price =
    typeof amount === 'number'
      ? amount
      : parseFloat(amount.assetAmount.toFixed(2))

  if (price > 9) {
    return 2
  } else if (price > 0.9) {
    return 3
  } else {
    return 4
  }
}

const useFormat = (): BigNumber.Config['FORMAT'] => ({
  prefix: '$',
  groupSeparator: useGroupSeparator(),
  groupSize: 3,
  decimalSeparator: '.',
})

export const formatPrice = (amount: Amount | number) => {
  const format = useFormat()
  const decimals = getNumberOfDecimals(amount)

  if (typeof amount === 'number') {
    const bigNumber = new BigNumber(amount.toFixed(decimals))
    BigNumber.config({ FORMAT: format })

    return bigNumber.toFormat()
  } else {
    return amount.toFixedDecimal(decimals, format)
  }
}
