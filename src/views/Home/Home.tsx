import { dashboardMockData } from 'views/Home/mockData'
import { useHome } from 'views/Home/useHome'

import { Box } from 'components/Box'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { Input } from 'components/Input'
import { PoolCard } from 'components/PoolCard'
import { PoolTable } from 'components/PoolTable'
import { Select } from 'components/Select'
import { Statistics } from 'components/Statistics'
import { StatsList } from 'components/StatsList'
import { Typography } from 'components/Typography'

import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

const Home = () => {
  const { pools } = useMidgard()
  console.log('🔥 midgard pools:', JSON.stringify(pools))

  const { chainAssetFilterIndex, setChainAssetFilterIndex } = useHome()

  return (
    <Box className="gap-12 overflow-x-hidden" col>
      <StatsList list={dashboardMockData.statsList} scrollable />

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
        <Box className="flex-wrap gap-4">
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
        </Box>
      </Box>

      <Box className="gap-8" col>
        <Typography variant="h3">{t('common.liquidityPools')}</Typography>
        <Box justify="between" className="flex-wrap gap-8">
          <Input placeholder="Search" icon="search" />

          <Select
            options={['All', 'Native', 'ERC20', 'BEP2']}
            activeIndex={chainAssetFilterIndex}
            onChange={setChainAssetFilterIndex}
          />
        </Box>
        <PoolTable data={dashboardMockData.pools} />
      </Box>
    </Box>
  )
}

export default Home
