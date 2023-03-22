import { Amount, AssetEntity, Pool, Price } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useApp } from 'store/app/hooks';

type Value = Amount | number | string;

type FormatOptions = {
  prefix?: string;
  decimals?: number;
  decimalSeparator?: string;
  groupSize?: number;
};

const useGroupSeparator = () => {
  const { thousandSeparator } = useApp();

  switch (thousandSeparator) {
    case 'comma':
      return ',';

    case 'space':
      return ' ';

    default:
      return '';
  }
};

const getNumberOfDecimals = (amount: Value) => {
  if (!amount) return 2;
  const price =
    typeof amount === 'object'
      ? parseFloat(amount.assetAmount.toFixed(2))
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

const useFormat = (options: FormatOptions = {}) => {
  const groupSeparator = useGroupSeparator();

  const format: BigNumber.Config['FORMAT'] = useMemo(
    () => ({
      prefix: 'prefix' in options ? options.prefix : '$',
      groupSeparator,
      groupSize: 'groupSize' in options ? options.groupSize : 3,
      decimalSeparator: 'decimalSeparator' in options ? options.decimalSeparator : '.',
    }),
    [groupSeparator, options],
  );

  return format;
};

const formatter = ({
  amount,
  format,
  decimals,
}: {
  amount: Value;
  format: ReturnType<typeof useFormat>;
  decimals?: number;
}) => {
  const numOfDecimals = decimals || getNumberOfDecimals(amount);

  if (amount && typeof amount === 'object') {
    return amount.toSignificantWithMaxDecimals(6, 8, format);
  } else if (typeof amount === 'number') {
    const bigNumber = new BigNumber(amount.toFixed(numOfDecimals));

    return bigNumber.toFormat(format);
  } else {
    return amount;
  }
};

export const formatPrice = (amount: Value, options?: FormatOptions) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const format = useFormat(options);

  return formatter({ amount, format });
};

export const useFormatPrice = (options?: FormatOptions) => {
  const format = useFormat(options);

  return useCallback(
    (amount: Value, inlineFormat?: FormatOptions) =>
      formatter({
        amount,
        format: { ...format, ...inlineFormat },
        decimals: options?.decimals || (amount instanceof Amount ? amount.decimal : undefined),
      }),
    [format, options],
  );
};

export const runeToAssetPrice = ({
  runeAmount,
  quoteAsset,
  pools,
}: {
  runeAmount: Amount;
  quoteAsset?: AssetEntity | null;
  pools: Pool[];
}) =>
  new Price({
    baseAsset: AssetEntity.RUNE(),
    quoteAsset: quoteAsset || AssetEntity.RUNE(),
    pools,
    priceAmount: runeAmount,
  });
