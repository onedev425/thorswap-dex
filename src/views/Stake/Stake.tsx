import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { StakingCard } from 'components/StakingCard'

import { t } from 'services/i18n'

import { farmData } from './farmData'
import { ThorchainLPCard } from './ThorchainLPCard'

const Stake = () => {
  return (
    <div className="container mx-auto">
      <Helmet title={t('common.staking')} content={t('common.staking')} />
      <Box className="gap-2.5 flex-wrap">
        {farmData.map(
          ({ lpToken, ...rest }) =>
            lpToken && (
              <StakingCard {...rest} key={lpToken} stakingToken={lpToken} />
            ),
        )}

        <ThorchainLPCard />
      </Box>
    </div>
  )
}

export default Stake
