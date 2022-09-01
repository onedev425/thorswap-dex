import { Amount } from '@thorswap-lib/multichain-sdk';
import { InputProps } from 'components/Input/types';

export type AmountProps = {
  amountValue: Amount;
  onAmountChange?: (value: Amount) => void;
};

export type InputAmountProps = InputProps & AmountProps;
