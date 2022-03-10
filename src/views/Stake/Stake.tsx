import { Box } from 'components/Atomic'
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
  return (
    <div className="container mx-auto">
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
