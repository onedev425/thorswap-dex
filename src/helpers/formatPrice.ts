import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useCallback } from 'react';

type Value = AssetValue | SwapKitNumber | number | string;

type FormatOptions = { prefix: string; decimals?: number };

const getNumberOfDecimals = (amount: Value) => {
  if (!amount) return 2;
  const price =
    typeof amount === 'object'
      ? parseFloat(amount.toSignificant(2))
      : typeof amount === 'string'
        ? parseFloat(amount)
        : amount;

  if (price > 9) {
    return 2;
  } else if (price > 0.9) {
    return 3;
  } else {
    return 4;
  }
};

const formatter = ({
  amount,
  format,
  decimals,
}: {
  amount: Value;
  format?: FormatOptions;
  decimals?: number;
}) => {
  const parsedAmount = typeof amount === 'object' ? amount.getValue('string') : amount;
  if (!parsedAmount) return '0';

  const numOfDecimals = decimals || getNumberOfDecimals(parsedAmount);

  if (parsedAmount && typeof parsedAmount === 'string') {
    return parsedAmount;
  } else {
    const skNumber = new SwapKitNumber(parsedAmount);
    return skNumber.gt(0) ? `${format?.prefix || ''}${skNumber.toFixed(numOfDecimals)}` : '0';
  }
};

export const useFormatPrice = (options?: FormatOptions) =>
  useCallback(
    (amount: Value, format?: FormatOptions) =>
      formatter({
        amount,
        format: format || options,
        decimals: options?.decimals || (amount instanceof AssetValue ? amount.decimal : undefined),
      }),
    [options],
  );
