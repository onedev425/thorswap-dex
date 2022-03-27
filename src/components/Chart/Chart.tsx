import { memo, useMemo, useState } from 'react'

import { Bar, Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js'
import classNames from 'classnames'

import { Box, Select } from 'components/Atomic'
import { ChartHeader } from 'components/Chart/ChartHeader'
import { ChartPlaceholder } from 'components/Chart/ChartPlaceholder'
import { ChartTypeSelect } from 'components/Chart/ChartTypeSelect'
import { useChartData } from 'components/Chart/useChartData'

import {
  BarChartType,
  ChartProps,
  ChartTimeFrame,
  ChartType,
  LineChartType,
  chartTimeFrames,
} from './types'

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  SubTitle,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
)

export const Chart = memo(
  ({
    className,
    title,
    chartIndexes = [],
    chartData,
    selectedIndex,
    hideLabel = false,
    hasGrid = false,
    previewChartType = ChartType.Bar,
    selectChart,
  }: ChartProps) => {
    const [chartTimeFrame, setChartTimeFrame] = useState(ChartTimeFrame.AllTime)

    const {
      isChartLoading,
      selectedChartType,
      values,
      parsedChartData,
      options,
    } = useChartData({
      chartData,
      chartTimeFrame,
      selectedIndex,
      hasGrid,
      hideLabel,
    })

    const renderChart = useMemo(() => {
      if (!parsedChartData?.datasets?.length) return null

      switch (selectedChartType) {
        case ChartType.Bar:
          return (
            <Bar options={options} data={parsedChartData as BarChartType} />
          )

        case ChartType.CurvedLine:
        case ChartType.Area:
        case ChartType.Line:
          return (
            <Line options={options} data={parsedChartData as LineChartType} />
          )
      }
    }, [selectedChartType, options, parsedChartData])

    return (
      <Box className={classNames('w-full h-full', className)} col>
        <Box alignCenter justify="between" row>
          <Box className="gap-y-1" ml={2} col>
            <ChartHeader title={title} values={values} />

            <ChartTypeSelect
              chartTypeIndexes={chartIndexes}
              selectChartTypeIndex={selectChart}
              selectedChartTypeIndex={selectedIndex}
            />
          </Box>

          <Select
            options={chartTimeFrames}
            activeIndex={chartTimeFrame}
            onChange={setChartTimeFrame}
          />
        </Box>

        <div className="w-full my-4 border border-solid !border-opacity-25 dark:border-dark-border-primary" />

        <Box
          center={isChartLoading}
          className={classNames('min-h-[280px] max-h-[300px]', {
            relative: isChartLoading,
          })}
        >
          {isChartLoading ? (
            <ChartPlaceholder
              options={options}
              previewChartType={previewChartType}
            />
          ) : (
            renderChart
          )}
        </Box>
      </Box>
    )
  },
)
