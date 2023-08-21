import { Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Box } from 'components/Atomic';
import { memo, useMemo } from 'react';
import { useApp } from 'store/app/hooks';

type Props = {
  title: string;
  values: number[];
};

export const ChartHeader = memo(({ values, title }: Props) => {
  const lastValue = values?.[values?.length - 1] ?? 0;
  const { baseCurrency } = useApp();

  const formattedValue = useMemo(() => {
    const amountObj = Amount.fromNormalAmount(lastValue).toAbbreviate(2);
    if (baseCurrency.includes('USD')) return `$ ${amountObj}`;
    if (baseCurrency.includes('RUNE')) return `ᚱ ${amountObj}`;
    return `${amountObj} ${baseCurrency}`;
  }, [baseCurrency, lastValue]);

  return (
    <Box alignCenter className="lg:flex-row" justify="start">
      <Text as="span" textStyle="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">{` ${formattedValue} `}</span>
      </Text>
    </Box>
  );
});
