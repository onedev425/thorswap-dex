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

const Home = () => {
  const { pools } = useMidgard()
  console.log('🔥 midgard pools:', JSON.stringify(pools))

  const { chainAssetFilterIndex, setChainAssetFilterIndex } = useHome()

  return (
    <Box className="gap-12 overflow-x-hidden" col>
      <StatsList list={dashboardMockData.statsList} scrollable />

      <Box className="gap-10">
        <Box className="gap-8 flex-1" col>
          <Statistics
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

        <Box className="gap-8 flex-1" col>
          <Statistics
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
        <Typography variant="h3">Swap cross chain assets</Typography>
        <Box className="flex-wrap gap-6" justifyCenter>
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
        <Typography variant="h3">Liquidity Pools</Typography>
        <Box justify="between">
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
