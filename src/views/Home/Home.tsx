import { Box } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { t } from 'services/i18n';

import { GlobalChart } from './GlobalChart';
import { GlobalStats } from './GlobalStats';
import { PoolListView } from './PoolListView';

const Home = () => {
  return (
    <Box col>
      <Helmet content={t('common.thorswapDescription')} title={t('common.THORSwap')} />

      <Box col>
        <GlobalStats />
        <GlobalChart />
        <PoolListView />
      </Box>
    </Box>
  );
};

export default Home;
