import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useCallback } from 'react';

type Value = AssetValue | SwapKitNumber | number | string;

const getNumberOfDecimals = (amount: Value) => {
  if (!amount) return 2;
  const price =
    typeof amount === 'object'
      ? Number.parseFloat(amount.toSignificant(2))
      : typeof amount === 'string'
        ? Number.parseFloat(amount)
        : amount;

  if (price > 9) return 2;
  if (price > 0.9) return 3;
  return 4;
};

const formatter = ({
  amount,
  decimals,
  prefix,
}: {
  prefix?: string;
  amount: Value;
  decimals?: number;
}) => {
  const parsedAmount = typeof amount === 'object' ? amount.getValue('string') : amount;
  if (!parsedAmount) return '0';

  const numOfDecimals = decimals || getNumberOfDecimals(parsedAmount);

  if (parsedAmount && typeof parsedAmount === 'string') {
    return parsedAmount;
  }

  const skNumber = new SwapKitNumber(parsedAmount);
  return skNumber.toCurrency(prefix || '$', { decimal: numOfDecimals });
};

export const useFormatPrice = (decimals?: number, prefix?: string) =>
  useCallback(
    (amount: Value) =>
      formatter({
        amount,
        prefix,
        decimals: decimals || (amount instanceof AssetValue ? amount.decimal : undefined),
      }),
    [decimals, prefix],
  );
