import {
  useCallback,
  useState,
  useEffect,
  memo,
  ChangeEvent,
  useMemo,
} from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { Input } from 'components/Input'

import { useFormatPrice } from 'helpers/formatPrice'

import { InputAmountProps } from './types'
import { getAmountFromString } from './utils'

export const InputAmount = memo(
  ({ amountValue, onAmountChange, ref, ...otherProps }: InputAmountProps) => {
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

    const handleChange = useCallback(
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
      if (inputValue) {
        handleRawValueChange(inputValue)
      }
    }, [inputValue, handleRawValueChange])

    return (
      <Input
        {...otherProps}
        placeholder="0"
        value={rawValue}
        onChange={handleChange}
        disabled={!onAmountChange}
      />
    )
  },
)
