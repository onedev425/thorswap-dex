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

  const formattedValue = runeToCurrency(Amount.fromNormalAmount(lastValue));

  return (
    <Box alignCenter className="lg:flex-row" justify="start">
      <Text as="span" textStyle="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">{` ${formattedValue} `}</span>
      </Text>
    </Box>
  );
});
