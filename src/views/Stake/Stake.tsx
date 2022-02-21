import { Box, Typography } from 'components/Atomic'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { StakingCard } from 'components/StakingCard'
import { StatsType } from 'components/Stats'
import { StatsList } from 'components/StatsList'
import { StatsListScrollable } from 'components/StatsList/StatsListScrollable'

const sampleData = [
  { x: 'Sep 1', y: 0 },
  { x: 'Sep 2', y: 30 },
  { x: 'Sep 3', y: 25 },
  { x: 'Sep 4', y: 40 },
  { x: 'Sep 5', y: 60 },
  { x: 'Sep 6', y: 55 },
  { x: 'Sep 7', y: 50 },
  { x: 'Sep 8', y: 40 },
  { x: 'Sep 9', y: 20 },
  { x: 'Sep 10', y: 60 },
  { x: 'Sep 11', y: 90 },
  { x: 'Sep 12', y: 100 },
  { x: 'Sep 13', y: 95 },
  { x: 'Sep 14', y: 75 },
  { x: 'Sep 15', y: 60 },
  { x: 'Sep 16', y: 35 },
  { x: 'Sep 17', y: 80 },
  { x: 'Sep 18', y: 110 },
  { x: 'Sep 19', y: 100 },
  { x: 'Sep 20', y: 90 },
  { x: 'Sep 21', y: 40 },
  { x: 'Sep 22', y: 30 },
  { x: 'Sep 23', y: 10 },
  { x: 'Sep 24', y: 20 },
  { x: 'Sep 26', y: 30 },
  { x: 'Sep 27', y: 28 },
  { x: 'Sep 28', y: 26 },
  { x: 'Sep 29', y: 20 },
  { x: 'Sep 30', y: 10 },
  { x: 'Oct 1', y: 30 },
  { x: 'Oct 2', y: 40 },
  { x: 'Oct 3', y: 80 },
  { x: 'Oct 4', y: 90 },
  { x: 'Oct 5', y: 40 },
  { x: 'Oct 6', y: 50 },
  { x: 'Oct 7', y: 30 },
  { x: 'Oct 8', y: 60 },
  { x: 'Oct 9', y: 20 },
  { x: 'Oct 10', y: 10 },
]
const list: StatsType[] = [
  {
    color: 'purple',
    iconName: 'lightning',
    label: '$THOR MarketCap',
    value: '$ 25.000.000',
  },
  {
    color: 'blue',
    iconName: 'chartArea',
    label: 'FDV',
    value: '$ 595.000.000',
  },
  {
    color: 'red',
    iconName: 'lightning',
    label: 'Total Staked Value',
    value: '$ 13.000.000',
  },
  {
    color: 'blueLight',
    iconName: 'settings',
    label: 'Total Staked $THOR',
    value: '100,50%',
  },

  {
    color: 'purple',
    iconName: 'chartArea2',
    label: 'Circulating Supply',
    value: '24.500.00 $T',
  },
  {
    color: 'green',
    iconName: 'lightning',
    label: 'Total Supply',
    value: '$ 25.000.000',
  },
  {
    color: 'yellow',
    iconName: 'chartPie',
    label: '24h Volume',
    value: '$46,82.56',
  },
  {
    color: 'green',
    iconName: 'fire',
    label: 'Total Volume',
    value: '$ 181.35M',
  },
]
const Stake = () => {
  const change = '+10%'
  const token = 'THORSwap Token ($THOR)'

  return (
    <div className="container mx-auto">
      <Box className="w-full xl:hidden pb-8">
        <StatsListScrollable list={list} />
      </Box>
      <div className="flex mb-16">
        <div className="w-[500px] h-auto hidden xl:block">
          <StatsList list={list} />
        </div>
        <Box className="flex-1 w-auto" col>
          <div className="flex-row">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {token}
            </Typography>
          </div>
          <div className="flex-row">
            <Typography variant="h2" color="green" fontWeight="medium">
              {change}
            </Typography>
          </div>
          <Box className="flex-1">
            <Chart
              type={ChartType.Area}
              data={sampleData}
              className="mh-[450px]"
            />
          </Box>
        </Box>
      </div>
      <div className="flex space-x-6">
        <Box className="flex-wrap gap-4">
          <StakingCard className="h-auto" />
          <StakingCard className="h-auto" />
          <StakingCard className="h-auto" />
        </Box>
      </div>
    </div>
  )
}

export default Stake
