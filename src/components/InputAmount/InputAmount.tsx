import { useCallback, useState, useEffect, memo, ChangeEvent } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { Input } from 'components/Input'

import { useFormatPrice } from 'helpers/formatPrice'

import { InputAmountProps } from './types'
import { getAmountFromString } from './utils'

export const InputAmount = memo(
  ({ amountValue, onAmountChange, ref, ...otherProps }: InputAmountProps) => {
    const formatPriceOptions = { decimals: amountValue.decimal, prefix: '' }

    const formatPrice = useFormatPrice(formatPriceOptions)
    const [rawValue, setRawValue] = useState(formatPrice(amountValue))

    const handleRawValueChange = useCallback(
      (amount: Amount | string) => {
        setRawValue(formatPrice(amount))
      },
      [formatPrice],
    )

    const handleChange = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        if (!amountValue) {
          handleRawValueChange(value)
          return
        }

        const newValue = getAmountFromString(value, amountValue.decimal)

        // if value is a valid number, trigger onChange
        if (newValue) {
          handleRawValueChange(newValue)
          onAmountChange?.(newValue)
        } else {
          // if value is not a valid number, update raw input value
          handleRawValueChange(value)
        }
      },
      [amountValue, handleRawValueChange, onAmountChange],
    )

    useEffect(() => {
      handleRawValueChange(amountValue)
    }, [amountValue, handleRawValueChange])

    return (
      <Input
        {...otherProps}
        value={rawValue}
        onChange={handleChange}
        disabled={!onAmountChange}
      />
    )
  },
)
