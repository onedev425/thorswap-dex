import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { AmountProps } from 'components/InputAmount/types'
import { getAmountFromString } from 'components/InputAmount/utils'

import { useFormatPrice } from 'helpers/formatPrice'

export const useInputAmount = ({
  amountValue,
  onAmountChange,
}: AmountProps) => {
  const inputValue = useMemo(
    () => (amountValue?.gt(0) ? amountValue : undefined),
    [amountValue],
  )

  const formatPriceOptions = useMemo(
    () => ({ decimals: inputValue?.decimal, prefix: '' }),
    [inputValue?.decimal],
  )

  const formatPrice = useFormatPrice(formatPriceOptions)
  const [rawValue, setRawValue] = useState(
    inputValue ? formatPrice(inputValue) : '',
  )

  const handleRawValueChange = useCallback(
    (amount: Amount | string) => {
      setRawValue(formatPrice(amount))
    },
    [formatPrice],
  )

  const onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const amount = inputValue || getAmountFromString(value, 8)
      const newValue = getAmountFromString(value, amount?.decimal || 8)

      // if value is a valid number, trigger onChange
      if (newValue) {
        handleRawValueChange(value ? newValue : '')
        onAmountChange?.(newValue)
      } else {
        // if value is not a valid number, update raw input value
        handleRawValueChange(value)
      }
    },
    [inputValue, handleRawValueChange, onAmountChange],
  )

  useEffect(() => {
    handleRawValueChange(inputValue || '')
  }, [inputValue, handleRawValueChange])

  return { onChange, rawValue }
}
