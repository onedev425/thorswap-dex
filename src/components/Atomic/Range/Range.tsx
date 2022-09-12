import { Amount } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { useInputAmount } from 'components/InputAmount/useInputAmount';
import { useTheme } from 'components/Theme/ThemeContext';
import { useRef } from 'react';

import './Range.css';

type Props = {
  onAmountChange: (e: Amount) => void;
  amountValue: Amount;
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
      step="25"
      type="range"
      value={rawValue || '0'}
    />
  );
};

export default Range;
