import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { StatsGroup } from 'components/StatsGroup'

import { useStatsData } from './useStatsData'

const Stats = () => {
  const statsGroupData = useStatsData()

  return (
    <Box row className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
      {statsGroupData.map((stats) => (
        <div key={stats.title}>
          <Helmet title="Stats" content="Stats" />

          <StatsGroup {...stats} />
        </div>
      ))}
    </Box>
  )
}

export default Stats
