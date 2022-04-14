import { memo, useMemo } from 'react'

import { Bar, Line } from 'react-chartjs-2'

import { Box, Icon, Typography } from 'components/Atomic'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { ThemeType } from 'types/app'

import { getChartData } from './config/chartData'
import { getChartOptions } from './config/chartOptions'
import { getRandomChartData } from './config/utils'
import { BarChartType, LineChartType, ChartType } from './types'

type Props = {
  previewChartType: ChartType
  options: ReturnType<typeof getChartOptions>
}

const randomData = getRandomChartData()

export const ChartPlaceholder = memo(({ previewChartType, options }: Props) => {
  const { themeType } = useApp()

  const randomSeries = useMemo(
    () =>
      getChartData(
        previewChartType,
        randomData.labels,
        randomData.values,
        themeType === ThemeType.Light || true,
      ),
    [previewChartType, themeType],
  )

  return (
    <>
      <Box className="w-full h-full">
        {previewChartType === ChartType.Bar ? (
          <Bar options={options} data={randomSeries as BarChartType} />
        ) : (
          <Line options={options} data={randomSeries as LineChartType} />
        )}
      </Box>

      <Box className="absolute w-full h-full backdrop-blur-sm" center col>
        <Icon name="refresh" color="primary" spin size={16} />
        <Typography className="mt-2">{t('common.loading')}</Typography>
      </Box>
    </>
  )
})
