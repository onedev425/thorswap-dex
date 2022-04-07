/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import BigNumber from 'bignumber.js'

import { useApp } from 'redux/app/hooks'

type Value = Amount | number | string

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

const getNumberOfDecimals = (amount: Value) => {
  const price =
    typeof amount === 'object'
      ? parseFloat(amount.assetAmount.toFixed(2))
      : amount

  if (price > 9) {
    return 2
  } else if (price > 0.9) {
    return 3
  } else {
    return 4
  }
}

const useFormat = (options: FormatOptions = {}): BigNumber.Config['FORMAT'] => {
  const groupSeparator = useGroupSeparator()

  return {
    prefix: 'prefix' in options ? options.prefix : '$',
    groupSeparator,
    groupSize: 3,
    decimalSeparator:
      'decimalSeparator' in options ? options.decimalSeparator : '.',
  }
}

const formatter = (amount: Value, format: BigNumber.Config['FORMAT']) => {
  const decimals = getNumberOfDecimals(amount)

  if (typeof amount === 'object') {
    return amount.toFixedDecimal(decimals, format)
  } else {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount
    const bigNumber = new BigNumber(number.toFixed(decimals))

    return format ? bigNumber.toFormat(format) : bigNumber.toFormat()
  }
}

export const formatPrice = (amount: Value, options?: FormatOptions) => {
  const format = useFormat(options)
  return formatter(amount, format)
}

export const useFormatPrice = (options?: FormatOptions) => {
  const format = useFormat(options)

  return useCallback(
    (amount: Value) => {
      return formatter(amount, format)
    },
    [format],
  )
}
