import { dashboardMockData } from 'views/Home/mockData'
import { PoolListView } from 'views/PoolListView'

import { Box, Typography } from 'components/Atomic'
import { GlobalChart } from 'components/GlobalChart'
import { GlobalStats } from 'components/GlobalStats'
import { Helmet } from 'components/Helmet'
import { HorizontalSlider } from 'components/HorizontalSlider'
import { PoolCard } from 'components/PoolCard'

import { t } from 'services/i18n'

const Home = () => {
  return (
    <Box className="gap-12 overflow-x-hidden" col>
      <Helmet
        title="THORSwap"
        content="THORSwap is world's first multi-chain dex powered by THORChain"
      />

      <GlobalStats />

      <GlobalChart />

      <Box className="gap-8" col>
        <Typography variant="h3">
          {t('views.home.swapCrossChainAssets')}
        </Typography>

        <Box center className="flex-wrap gap-4">
          <HorizontalSlider itemWidth={302}>
            {dashboardMockData.featuredPools.map((p) => (
              <PoolCard key={p.asset.ticker} {...p} />
            ))}
          </HorizontalSlider>
        </Box>

        <PoolListView />
      </Box>
    </Box>
  )
}

export default Home
