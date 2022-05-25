import { memo } from 'react'

import { Input } from 'components/Input'
import { useInputAmount } from 'components/InputAmount/useInputAmount'

import { InputAmountProps } from './types'

export const InputAmount = memo(
  ({ amountValue, onAmountChange, ref, ...otherProps }: InputAmountProps) => {
    const { rawValue, onChange } = useInputAmount({
      amountValue,
      onAmountChange,
    })

    return (
      <Input
        {...otherProps}
        placeholder="0"
        value={rawValue}
        onChange={onChange}
        disabled={!onAmountChange}
      />
    )
  },
)
