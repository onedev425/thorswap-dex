import { Fragment, memo } from 'react'

import classNames from 'classnames'

import { Typography, Box } from 'components/Atomic'

type Props = {
  chartTypeIndexes: string[]
  selectChartTypeIndex: (index: string) => void
  selectedChartTypeIndex: string
}

export const ChartTypeSelect = memo(
  ({
    chartTypeIndexes,
    selectedChartTypeIndex,
    selectChartTypeIndex,
  }: Props) => {
    return (
      <Box className="space-x-2" row>
        {chartTypeIndexes.map((chartIndex, index) => (
          <Fragment key={chartIndex}>
            {index !== 0 && <Typography> / </Typography>}

            <div
              key={chartIndex}
              className="cursor-pointer"
              onClick={() => selectChartTypeIndex(chartIndex)}
            >
              <Typography
                color={
                  chartIndex === selectedChartTypeIndex
                    ? 'primary'
                    : 'secondary'
                }
                variant="body"
                fontWeight="bold"
                className={classNames('hover:underline underline-offset-4', {
                  underline: chartIndex === selectedChartTypeIndex,
                })}
              >
                {chartIndex}
              </Typography>
            </div>
          </Fragment>
        ))}
      </Box>
    )
  },
)
