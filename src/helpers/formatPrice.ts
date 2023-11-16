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
  if (amount && typeof amount === 'object') {
    amount = amount.getValue('string');
    if (!amount) return '0';
  }

  const numOfDecimals = decimals || getNumberOfDecimals(amount);

  if (amount && typeof amount === 'string') {
    return amount.startsWith('0.')
      ? amount
      : `${format?.prefix || ''}${new SwapKitNumber(amount).toFixed(numOfDecimals)}`;
  } else {
    const skNumber = new SwapKitNumber(amount);
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
