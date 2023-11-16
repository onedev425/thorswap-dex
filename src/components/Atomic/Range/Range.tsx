import type { SwapKitNumber } from '@swapkit/core';
import classNames from 'classnames';
import { useInputAmount } from 'components/InputAmount/useInputAmount';
import { useTheme } from 'components/Theme/ThemeContext';
import { useRef } from 'react';

import './Range.css';

type Props = {
  onAmountChange: (e: SwapKitNumber) => void;
  amountValue: SwapKitNumber;
};

const Range = ({ onAmountChange, amountValue }: Props) => {
  const slider = useRef(null);
  const { rawValue, onChange } = useInputAmount({
    amountValue,
    onAmountChange,
  });
  const { isLight } = useTheme();

  return (
    <input
      className={classNames('range', { light: isLight, dark: !isLight })}
      max="100"
      min="0"
      onChange={onChange}
      ref={slider}
      step="1"
      type="range"
      value={rawValue || '0'}
    />
  );
};

export default Range;
