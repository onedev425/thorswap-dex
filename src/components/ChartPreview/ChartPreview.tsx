import { memo, useMemo } from 'react'

import { Line } from 'react-chartjs-2'

import classNames from 'classnames'

import { Box } from 'components/Atomic'

import { getDataForCurvedLineChart } from './config/chartData'
import { getChartOptions } from './config/chartOptions'

type ChartProps = {
  className?: string
  label: string
  values: number[]
  hideLabel?: boolean
  hasGrid?: boolean
}

export const ChartPreview = memo(
  ({
    className,
    label,
    values,
    hideLabel = false,
    hasGrid = false,
  }: ChartProps) => {
    const { chartData, options } = useMemo(
      () => ({
        chartData: getDataForCurvedLineChart([label], values),
        options: getChartOptions(hideLabel, hasGrid),
      }),
      [hasGrid, hideLabel, label, values],
    )

    return (
      <Box className={classNames('flex-1 w-full h-full relative', className)}>
        <Box className="absolute inset-0">
          <Line options={options} data={chartData} />
        </Box>
      </Box>
    )
  },
)
