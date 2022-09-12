import { Amount } from '@thorswap-lib/multichain-core';
import { InputProps } from 'components/Input/types';

export type AmountProps = {
  amountValue: Amount;
  onAmountChange?: (value: Amount) => void;
};

export type InputAmountProps = InputProps & AmountProps;
