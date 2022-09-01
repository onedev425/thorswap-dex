import { Box, Typography } from 'components/Atomic';
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
      <Typography component="span" variant="h3">
        {title}

        <span className="text-blue dark:text-btn-primary">
          {` ${unit}${abbreviateNumber(values?.[values.length - 1] ?? 0, 2)} `}
        </span>

        <Typography
          className="mb-1"
          color={changePercentage >= 0 ? 'green' : 'red'}
          component="span"
          fontWeight="semibold"
        >
          ({changePercentage >= 0 ? '+' : '-'}
          {changePercentage
            ? `${Math.abs(changePercentage).toFixed(2)}%`
            : `$${Math.abs(changePercentage).toFixed(2)}`}
          )
        </Typography>
      </Typography>
    </Box>
  );
});
