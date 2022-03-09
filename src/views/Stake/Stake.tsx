import { Box, Select, Typography } from 'components/Atomic'
import { StakingCard } from 'components/StakingCard'
import { StatsType } from 'components/Stats'
import { StatsList } from 'components/StatsList/StatsList'

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
            <Box className="w-full pb-4 justify-items-start sm:justify-items-end sm:w-auto">
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
        </Box>
      </div>

      <Box className="w-full" marginBottom={40} alignCenter>
        <StatsList list={list} />
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
