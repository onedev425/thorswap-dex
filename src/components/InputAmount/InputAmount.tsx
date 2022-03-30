import { useCallback, useState, useEffect } from 'react'

import { Input } from 'components/Input'

import { InputAmountProps } from './types'
import { getAmountFromString } from './utils'

export const InputAmount = ({
  amountValue,
  onAmountChange,
  ref,
  ...otherProps
}: InputAmountProps) => {
  const [rawValue, setRawValue] = useState(amountValue?.toSignificant(6) || '')

  useEffect(() => {
    setRawValue(amountValue?.toSignificant(6) ?? '')
  }, [amountValue])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!amountValue) {
        setRawValue(e.target.value)
        return
      }

      const newValue = getAmountFromString(e.target.value, amountValue.decimal)

      // if value is a valid number, trigger onChange
      if (newValue) {
        setRawValue(newValue.toSignificant(6))
        onAmountChange?.(newValue)
      } else {
        // if value is not a valid number, update raw input value
        setRawValue(e.target.value)
      }
    },
    [amountValue, onAmountChange],
  )

  return (
    <Input
      value={rawValue}
      onChange={handleChange}
      disabled={!onAmountChange}
      {...otherProps}
    />
  )
}
