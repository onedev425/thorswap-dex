import { Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Box } from 'components/Atomic';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { memo } from 'react';

type Props = {
  title: string;
  values: number[];
};

export const ChartHeader = memo(({ values, title }: Props) => {
  const runeToCurrency = useRuneToCurrency();
  const lastValue = values?.[values?.length - 1] ?? 0;
  const changePercentage =
    values.length >= 2 ? (lastValue / values[values.length - 2]) * 100 - 100 : 0;

  const formattedValue = runeToCurrency(Amount.fromNormalAmount(lastValue));

  return (
    <Box alignCenter className="lg:flex-row" justify="start">
      <Text as="span" textStyle="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">{` ${formattedValue} `}</span>

        <Text
          as="span"
          className="mb-1"
          fontWeight="semibold"
          variant={changePercentage >= 0 ? 'green' : 'red'}
        >
          ({changePercentage >= 0 ? '+' : '-'}
          {changePercentage
            ? `${Math.abs(changePercentage).toFixed(2)}%`
            : `$${Math.abs(changePercentage).toFixed(2)}`}
          )
        </Text>
      </Text>
    </Box>
  );
});
