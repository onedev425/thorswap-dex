import { dashboardMockData } from 'views/Home/mockData'
import { PoolListView } from 'views/PoolListView'

import { Box, Typography } from 'components/Atomic'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { GlobalStats } from 'components/GlobalStats'
import { HorizontalSlider } from 'components/HorizontalSlider'
import { PoolCard } from 'components/PoolCard'
import { Statistics } from 'components/Statistics'

import { t } from 'services/i18n'

const Home = () => {
  return (
    <Box className="gap-12 overflow-x-hidden" col>
      <GlobalStats />
      <Box className="flex-wrap">
        <Box className="w-full lg:w-1/2" col>
          <Statistics
            className="mb-8"
            percentage
            title="Volume"
            amount={dashboardMockData.stats.volume.amount}
            change={dashboardMockData.stats.volume.change}
            value={dashboardMockData.stats.volume.value}
          />
          <Chart
            className="min-h-[235px]"
            type={ChartType.Bar}
            data={dashboardMockData.stats.volume.chartData}
          />
        </Box>

        <Box className="w-full lg:w-1/2" col>
          <Statistics
            className="mb-8"
            percentage
            title="Liquidity"
            amount={dashboardMockData.stats.liquidity.amount}
            change={dashboardMockData.stats.liquidity.change}
            value={dashboardMockData.stats.liquidity.value}
          />
          <Chart
            className="min-h-[235px]"
            type={ChartType.CurvedLine}
            data={dashboardMockData.stats.liquidity.chartData}
          />
        </Box>
      </Box>

      <Box className="gap-8" col>
        <Typography variant="h3">
          {t('views.home.swapCrossChainAssets')}
        </Typography>

        <Box center className="flex-wrap gap-4">
          <HorizontalSlider itemWidth={302}>
            {dashboardMockData.featuredPools.map((p) => (
              <PoolCard
                key={p.ticker}
                coinSymbol={p.ticker}
                iconName={p.iconName}
                price={p.price}
                color={p.color}
                change={p.change}
              />
            ))}
          </HorizontalSlider>
        </Box>

        <PoolListView />
      </Box>
    </Box>
  )
}

export default Home
