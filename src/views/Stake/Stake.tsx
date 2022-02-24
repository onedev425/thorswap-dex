import { Box, Select, Typography } from 'components/Atomic'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { StakingCard } from 'components/StakingCard'
import { StatsType } from 'components/Stats'
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
  const token = {
    name: 'THORSwap Token',
    price: '$1.000.000',
    symbol: 'THOR',
  }

  return (
    <div className="container mx-auto">
      <div className="flex mb-16">
        <Box className="flex-1 w-auto" col>
          <Box
            alignCenter
            marginBottom={40}
            className="justify-between sm:flex-row"
            col
          >
            <Box className="pb-4 justify-items-start sm:justify-items-end w-full  sm:w-auto">
              <Typography variant="h3" color="primary" fontWeight="extrabold">
                {token.name}
              </Typography>
              <Typography
                variant="h3"
                color="secondary"
                className="ml-2"
                fontWeight="medium"
              >
                {`($${token.symbol})`}
              </Typography>
              <Typography
                variant="h2"
                color="greenLight"
                fontWeight="bold"
                className="ml-2"
              >
                {change}
              </Typography>
            </Box>
            <Box className="w-full justify-items-start sm:justify-items-end sm:w-auto sm:pl-8">
              <Select options={['1d', '3d', '1w', 'All']} />
            </Box>
          </Box>

          <Box className="min-h-[400px]">
            <Chart
              type={ChartType.Area}
              data={sampleData}
              className="mh-[450px]"
            />
          </Box>
        </Box>
      </div>
      <Box className="w-full" marginBottom={40} alignCenter>
        <Box>
          <StatsListScrollable list={list} />
        </Box>
      </Box>
      <div className="flex space-x-6">
        <Box className="flex-wrap gap-8">
          <StakingCard className="h-auto" />
          <StakingCard className="h-auto" />
          <StakingCard className="h-auto" />
        </Box>
      </div>
    </div>
  )
}

export default Stake
