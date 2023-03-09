import { Amount } from '@thorswap-lib/swapkit-core';
import { InputProps } from 'components/Input/types';

export type AmountProps = {
  amountValue: Amount;
  onAmountChange?: (value: Amount) => void;
};

export type InputAmountProps = InputProps & AmountProps;
