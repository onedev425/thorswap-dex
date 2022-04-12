import { Box } from 'components/Atomic'
import { GlobalChart } from 'components/GlobalChart'
import { GlobalStats } from 'components/GlobalStats'
import { Helmet } from 'components/Helmet'

import { t } from 'services/i18n'

import { PoolListView } from './PoolListView'

const Home = () => {
  return (
    <Box col>
      <Helmet
        title={t('common.THORSwap')}
        content={t('common.thorswapDescription')}
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
