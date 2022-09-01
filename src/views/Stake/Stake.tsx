import { Box } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { t } from 'services/i18n';

import { farmData } from './farmData';
import { StakingCard } from './StakingCard';
import { ThorchainLPCard } from './ThorchainLPCard';

const Stake = () => {
  return (
    <div className="container mx-auto">
      <Helmet content={t('common.staking')} title={t('common.staking')} />
      <Box className="gap-2.5 flex-wrap justify-center">
        {farmData.map(
          ({ lpToken, ...rest }) =>
            lpToken && <StakingCard {...rest} key={lpToken} stakingToken={lpToken} />,
        )}

        <ThorchainLPCard />
      </Box>
    </div>
  );
};

export default Stake;
