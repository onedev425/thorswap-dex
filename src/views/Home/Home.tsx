import { Box } from 'components/Atomic'
import { CustomiseDashboardPopover } from 'components/CustomiseDashboardPopover/CustomiseDashboardPopover'
import { GlobalChart } from 'components/GlobalChart'
import { GlobalStats } from 'components/GlobalStats'
import { Helmet } from 'components/Helmet'

import { useApp } from 'store/app/hooks'

import { PoolListView } from './PoolListView'

const Home = () => {
  const { areStatsShown } = useApp()

  return (
    <Box col>
      <Helmet
        title="THORSwap"
        content="THORSwap is world's first multi-chain dex powered by THORChain"
      />
      <Box
        display="none"
        className="justify-end"
        marginBottom={areStatsShown ? 4 : 0}
      >
        <CustomiseDashboardPopover />
      </Box>
      <Box col className="gap-12">
        <GlobalStats />
        <GlobalChart />

        <PoolListView />
      </Box>
    </Box>
  )
}

export default Home
