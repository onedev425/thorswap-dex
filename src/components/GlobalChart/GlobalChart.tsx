import { useState } from 'react'

import { Box } from 'components/Atomic'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'

import { t } from 'services/i18n'

import { volumeChartIndexes, liquidityChartIndexes } from './types'
import { useGlobalChartInfo } from './useGlobalChartInfo'

export const GlobalChart = () => {
  const [volumeChartIndex, setVolumeChartIndex] = useState('Total')
  const [liquidityChartIndex, setLiquidityChartIndex] = useState('Liquidity')
  const { volumeChartData, liquidityChartData } = useGlobalChartInfo()

  return (
    <Box col className="lg:space-x-8 lg:flex-row">
      <Box flex={1}>
        <Chart
          title={t('views.home.chart.volume')}
          chartIndexes={volumeChartIndexes}
          chartData={volumeChartData}
          selectedIndex={volumeChartIndex}
          selectChart={setVolumeChartIndex}
        />
      </Box>

      <Box flex={1}>
        <Chart
          title={t('views.home.chart.liquidity')}
          chartIndexes={liquidityChartIndexes}
          chartData={liquidityChartData}
          selectedIndex={liquidityChartIndex}
          previewChartType={ChartType.CurvedLine}
          selectChart={setLiquidityChartIndex}
        />
      </Box>
    </Box>
  )
}
