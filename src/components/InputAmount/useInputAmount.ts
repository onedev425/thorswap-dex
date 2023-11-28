import { BaseDecimal, type SwapKitNumber } from '@swapkit/core';
import type { AmountProps } from 'components/InputAmount/types';
import { getAmountFromString } from 'components/InputAmount/utils';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useInputAmount = ({ amountValue, onAmountChange }: AmountProps) => {
  const { decimal } = amountValue;
  const inputValue = useMemo(() => (amountValue?.gt(0) ? amountValue : undefined), [amountValue]);

  const [rawValue, setRawValue] = useState(
    inputValue ? inputValue.toCurrency('', { decimal }) : '',
  );

  const handleRawValueChange = useCallback(
    (amount: SwapKitNumber | string) => {
      setRawValue(typeof amount === 'string' ? amount : amount.toCurrency('', { decimal }));
    },
    [decimal],
  );

  const onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const newValue = getAmountFromString(value, decimal || BaseDecimal.THOR);

      // if value is a valid number, trigger onChange
      if (newValue) {
        handleRawValueChange(newValue);
        onAmountChange?.(newValue);
      } else {
        // if value is not a valid number, update raw input value
        handleRawValueChange(value);
      }
    },
    [decimal, handleRawValueChange, onAmountChange],
  );

  useEffect(() => {
    handleRawValueChange(inputValue || '');
  }, [inputValue, handleRawValueChange]);

  return { onChange, rawValue };
};
