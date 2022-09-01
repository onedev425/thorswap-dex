import classNames from 'classnames';
import { Box, Typography } from 'components/Atomic';
import { Fragment } from 'react';
import { t } from 'services/i18n';

type Props = {
  chartTypeIndexes: string[];
  selectChartTypeIndex: (index: string) => void;
  selectedChartTypeIndex: string;
};

export const ChartTypeSelect = ({
  chartTypeIndexes,
  selectedChartTypeIndex,
  selectChartTypeIndex,
}: Props) => {
  return (
    <Box row className="space-x-2">
      {chartTypeIndexes.map((chartIndex, index) => (
        <Fragment key={chartIndex}>
          {index !== 0 && <Typography> / </Typography>}

          <div
            className="cursor-pointer"
            key={chartIndex}
            onClick={() => selectChartTypeIndex(chartIndex)}
          >
            <Typography
              className={classNames('hover:underline underline-offset-4', {
                underline: chartIndex === selectedChartTypeIndex,
              })}
              color={chartIndex === selectedChartTypeIndex ? 'primary' : 'secondary'}
              fontWeight="bold"
              variant="body"
            >
              {t('views.home.chart', { context: chartIndex })}
            </Typography>
          </div>
        </Fragment>
      ))}
    </Box>
  );
};
