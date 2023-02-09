import { Text } from '@chakra-ui/react';
import { Box } from 'components/Atomic';
import { abbreviateNumber } from 'helpers/number';
import { memo } from 'react';

type Props = {
  title: string;
  values: number[];
  unit: string;
};

export const ChartHeader = memo(({ unit, values, title }: Props) => {
  const changePercentage =
    values.length >= 2 ? (values[values.length - 1] / values[values.length - 2]) * 100 - 100 : 0;

  return (
    <Box alignCenter className="lg:flex-row" justify="start">
      <Text as="span" textStyle="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">
          {` ${unit}${abbreviateNumber(values?.[values.length - 1] ?? 0, 2)} `}
        </span>

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
