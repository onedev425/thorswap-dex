import { Input } from 'components/Input';
import { useInputAmount } from 'components/InputAmount/useInputAmount';
import { memo } from 'react';

import { InputAmountProps } from './types';

export const InputAmount = memo(
  ({ amountValue, onAmountChange, ref: _ref, ...otherProps }: InputAmountProps) => {
    const { rawValue, onChange } = useInputAmount({
      amountValue,
      onAmountChange,
    });

    return (
      <Input
        {...otherProps}
        disabled={!onAmountChange}
        onChange={onChange}
        placeholder="0"
        value={rawValue}
      />
    );
  },
);
