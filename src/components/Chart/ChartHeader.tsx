import { Text } from '@chakra-ui/react';
import { SwapKitNumber } from '@swapkit/core';
import { Box } from 'components/Atomic';
import { memo, useMemo } from 'react';

type Props = {
  title: string;
  values: number[];
};

export const ChartHeader = memo(({ values, title }: Props) => {
  const lastValue = values?.[values?.length - 1] || 0;

  const formattedValue = useMemo(() => {
    const amountObj = new SwapKitNumber(lastValue).toAbbreviation(2);
    return `$ ${amountObj}`;
  }, [lastValue]);

  return (
    <Box alignCenter className="lg:flex-row" justify="start">
      <Text as="span" textStyle="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">{` ${formattedValue} `}</span>
      </Text>
    </Box>
  );
});
