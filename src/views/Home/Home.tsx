import { Box } from 'components/Atomic'
import { GlobalChart } from 'components/GlobalChart'
import { GlobalStats } from 'components/GlobalStats'
import { Helmet } from 'components/Helmet'

import { PoolListView } from './PoolListView'

const Home = () => {
  return (
    <Box className="gap-12" col>
      <Helmet
        title="THORSwap"
        content="THORSwap is world's first multi-chain dex powered by THORChain"
      />
      <GlobalStats />
      <GlobalChart />
      <PoolListView />
    </Box>
  )
}

export default Home
