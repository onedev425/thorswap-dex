import { Box } from 'components/Atomic'
import { GlobalChart } from 'components/GlobalChart'
import { GlobalStats } from 'components/GlobalStats'
import { Helmet } from 'components/Helmet'

import { PoolListView } from './PoolListView'

const Home = () => {
  return (
    <Box col>
      <Helmet
        title="THORSwap"
        content="THORSwap is world's first multi-chain dex powered by THORChain"
      />
      <Box col className="gap-12">
        <GlobalStats />
        <GlobalChart />

        <PoolListView />
      </Box>
    </Box>
  )
}

export default Home
