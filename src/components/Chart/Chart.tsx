import { useMemo, useState } from 'react'

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
import { takeRight } from 'lodash'
import moment from 'moment'

import { Box, Icon, Select, Typography } from 'components/Atomic'
import { getChartData } from 'components/Chart/config/chartData'
import { getChartOptions } from 'components/Chart/config/chartOptions'
import { getRandomChartData } from 'components/Chart/config/utils'

import { t } from 'services/i18n'

import { abbreviateNumber } from 'helpers/number'

import {
  ChartProps,
  ChartType,
  ChartTimeFrame,
  ChartValues,
  BarChartType,
  AreaChartType,
  LineChartType,
  CurvedLineChartType,
  chartTimeFrame,
} from './types'

ChartJS.register(
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
)

export const Chart = ({
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
  const [chartTimeframe, setChartTimeframe] = useState(ChartTimeFrame.AllTime)

  const selectedChartData = chartData?.[selectedIndex]
  const isChartLoading = selectedChartData?.loading ?? false
  const selectedChartType = selectedChartData?.type ?? ChartType.CurvedLine
  const selectedChartValues = selectedChartData?.values
  const unit = selectedChartData?.unit ?? ''
  const options = getChartOptions(hideLabel, hasGrid, unit)

  const randomData = useMemo(() => getRandomChartData(), [])

  const filteredByTime: ChartValues = useMemo(() => {
    if (chartTimeframe === ChartTimeFrame.AllTime) {
      return takeRight(selectedChartValues, 60) || []
    }

    return takeRight(selectedChartValues, 7) || []
  }, [selectedChartValues, chartTimeframe])

  const labels: Array<string> = filteredByTime.map((data) => {
    return moment.unix(data.time).format('MMM DD')
  })

  const values: Array<number> = filteredByTime.map((data) =>
    Number(data.value.split(',').join('')),
  )

  const changePercentage =
    values.length >= 2
      ? (values[values.length - 1] / values[values.length - 2]) * 100 - 100
      : 0

  const parsedChartData = useMemo(
    () => getChartData(selectedChartType, labels, values),
    [selectedChartType, labels, values],
  )

  const getRandomSeries = useMemo(
    () => getChartData(previewChartType, randomData.labels, randomData.values),
    [previewChartType, randomData],
  )

  const renderLoadingChart = useMemo(() => {
    return (
      <>
        <Box className="w-full h-full">
          {previewChartType === ChartType.Bar ? (
            <Bar options={options} data={getRandomSeries as BarChartType} />
          ) : (
            <Line
              options={options}
              data={getRandomSeries as CurvedLineChartType}
            />
          )}
        </Box>
        <Box className="absolute w-full h-full backdrop-blur-sm" center col>
          <Icon name="refresh" color="primary" spin size={16} />
          <Typography className="mt-2">{t('common.loading')}</Typography>
        </Box>
      </>
    )
  }, [previewChartType, getRandomSeries, options])

  const renderChart = useMemo(() => {
    switch (selectedChartType) {
      case ChartType.Bar:
        return <Bar options={options} data={parsedChartData as BarChartType} />

      case ChartType.Area:
        return (
          <Line options={options} data={parsedChartData as AreaChartType} />
        )

      case ChartType.Line:
        return (
          <Line options={options} data={parsedChartData as LineChartType} />
        )

      case ChartType.CurvedLine:
      default:
        return (
          <Line
            options={options}
            data={parsedChartData as CurvedLineChartType}
          />
        )
    }
  }, [selectedChartType, options, parsedChartData])

  return (
    <Box className={classNames('w-full h-full', className)} col>
      <Box alignCenter justify="between" row>
        <Box className="gap-y-1" ml={2} col>
          <Box className="space-x-2" row>
            <Typography variant="h3">
              {title}{' '}
              <span className="text-btn-primary">
                {abbreviateNumber(values?.[values.length - 1] ?? 0, 2)}
              </span>
            </Typography>
            <Box className="hidden lg:flex gap-x-1" row alignCenter>
              <Typography
                color={changePercentage > 0 ? 'green' : 'red'}
                fontWeight="semibold"
              >
                ({changePercentage > 0 ? '+' : '-'}
                {changePercentage
                  ? `${Math.abs(changePercentage).toFixed(2)}%`
                  : `$${Math.abs(changePercentage).toFixed(2)}`}
                )
              </Typography>
            </Box>
          </Box>
          <Box className="space-x-2" row>
            {chartIndexes.map((chartIndex, index) => (
              <>
                {index !== 0 && <Typography> / </Typography>}
                <div
                  key={chartIndex}
                  className="cursor-pointer"
                  onClick={() => selectChart(chartIndex)}
                >
                  <Typography
                    color={
                      chartIndex === selectedIndex ? 'primary' : 'secondary'
                    }
                    variant="body"
                    fontWeight="semibold"
                  >
                    {chartIndex}
                  </Typography>
                </div>
              </>
            ))}
          </Box>
        </Box>
        <Select
          options={chartTimeFrame}
          activeIndex={chartTimeframe}
          onChange={setChartTimeframe}
        />
      </Box>
      <div className="w-full my-4 border border-solid !border-opacity-25 dark:border-dark-border-primary" />
      {isChartLoading ? (
        <Box className="relative min-h-[280px] max-h-[300px]" center>
          {renderLoadingChart}
        </Box>
      ) : (
        <Box className="min-h-[280px] max-h-[300px]">
          {parsedChartData.datasets.length > 0 ? renderChart : null}
        </Box>
      )}
    </Box>
  )
}
