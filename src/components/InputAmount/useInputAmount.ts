import { BaseDecimal, type SwapKitNumber } from '@swapkit/core';
import type { AmountProps } from 'components/InputAmount/types';
import { getAmountFromString } from 'components/InputAmount/utils';
import { useFormatPrice } from 'helpers/formatPrice';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useInputAmount = ({ amountValue, onAmountChange }: AmountProps) => {
  const { decimal } = amountValue;
  const inputValue = useMemo(() => (amountValue?.gt(0) ? amountValue : undefined), [amountValue]);

  const formatPriceOptions = useMemo(() => ({ decimals: decimal, prefix: '' }), [decimal]);

  const formatPrice = useFormatPrice(formatPriceOptions);
  const [rawValue, setRawValue] = useState(inputValue ? formatPrice(inputValue) : '');

  const handleRawValueChange = useCallback(
    (amount: SwapKitNumber | string) => {
      setRawValue(formatPrice(amount));
    },
    [formatPrice],
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
