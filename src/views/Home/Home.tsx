import { dashboardMockData } from 'views/Home/mockData'
import { useHome } from 'views/Home/useHome'

import { Chart } from 'components/Chart'
import { Input } from 'components/Input'
import { PoolCard } from 'components/PoolCard'
import { PoolTable } from 'components/PoolTable'
import { Row } from 'components/Row'
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
    <div className="flex flex-col gap-12 overflow-x-hidden">
      <StatsList list={dashboardMockData.statsList} scrollable />

      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
          <Statistics
            title="Volume"
            amount={dashboardMockData.stats.volume.amount}
            change={dashboardMockData.stats.volume.change}
            value={dashboardMockData.stats.volume.value}
          />
          <Chart
            className="min-h-[235px]"
            type="bar"
            data={dashboardMockData.stats.volume.chartData}
          />
        </div>

        <div className="flex flex-col gap-8">
          <Statistics
            title="Liquidity"
            amount={dashboardMockData.stats.liquidity.amount}
            change={dashboardMockData.stats.liquidity.change}
            value={dashboardMockData.stats.liquidity.value}
          />
          <Chart
            className="min-h-[235px]"
            type="curved-line"
            data={dashboardMockData.stats.volume.chartData}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Typography variant="h3">Swap cross chain assets</Typography>
        <div className="flex flex-wrap gap-6 justify-center">
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
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Typography variant="h3">Liquidity Pools</Typography>
        <Row justify="between">
          <Input placeholder="Search" icon="search" />
          <Select
            options={['All', 'Native', 'ERC20', 'BEP2']}
            activeIndex={chainAssetFilterIndex}
            onChange={setChainAssetFilterIndex}
          />
        </Row>
        <PoolTable data={dashboardMockData.pools} />
      </div>
    </div>
  )
}

export default Home
