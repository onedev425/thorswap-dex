/* eslint-disable react-hooks/rules-of-hooks */
import { Amount } from '@thorswap-lib/multichain-sdk'
import BigNumber from 'bignumber.js'

import { useApp } from 'redux/app/hooks'

type FormatOptions = {
  prefix?: string
  decimalSeparator?: string
}

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

const useFormat = (options?: FormatOptions): BigNumber.Config['FORMAT'] => ({
  prefix: options?.prefix || '$',
  groupSeparator: useGroupSeparator(),
  groupSize: 3,
  decimalSeparator: options?.decimalSeparator || '.',
})

export const formatPrice = (
  amount: Amount | number,
  options?: FormatOptions,
) => {
  const format = useFormat(options)
  const decimals = getNumberOfDecimals(amount)

  if (typeof amount === 'number') {
    const bigNumber = new BigNumber(amount.toFixed(decimals))
    BigNumber.config({ FORMAT: format })

    return bigNumber.toFormat()
  } else {
    return amount.toFixedDecimal(decimals, format)
  }
}
