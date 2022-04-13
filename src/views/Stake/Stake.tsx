import { ThorchainLPCard } from 'views/Stake/ThorchainLPCard'

import { Box } from 'components/Atomic'
import { StakingCard } from 'components/StakingCard'
import { StatsType } from 'components/Stats'
import { StatsList } from 'components/StatsList/StatsList'

import { t } from 'services/i18n'

import { farmData } from './farmData'

const Stake = () => {
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
      label: t('views.stats.totalStakedValue'),
      value: '$ 13.000.000',
    },
    {
      color: 'blueLight',
      iconName: 'settings',
      label: t('views.stats.totalStakedTHOR'),
      value: '100,50%',
    },

    {
      color: 'purple',
      iconName: 'chartArea2',
      label: t('views.stats.circulatingSupply'),
      value: '24.500.00 $T',
    },
    {
      color: 'green',
      iconName: 'lightning',
      label: t('views.stats.totalSupply'),
      value: '$ 25.000.000',
    },
    {
      color: 'yellow',
      iconName: 'chartPie',
      label: t('views.stats.24Volume'),
      value: '$46,82.56',
    },
    {
      color: 'green',
      iconName: 'fire',
      label: t('views.stats.totalVolume'),
      value: '$ 181.35M',
    },
  ]

  return (
    <div className="container mx-auto">
      <Box className="w-full" marginBottom={40} alignCenter>
        <StatsList list={list} />
      </Box>

      <Box className="flex-col gap-4 md:flex-row">
        {farmData.map((farmInfo) => {
          const {
            exchange,
            farmName,
            assets,
            lpAsset,
            lpToken,
            stakeAddr,
            contractType,
            lpContractType,
          } = farmInfo

          if (!farmName) return <></>

          return (
            <StakingCard
              key={lpToken}
              farmName={farmName}
              stakingToken={lpToken}
              assets={assets}
              lpAsset={lpAsset}
              contractType={contractType}
              lpContractType={lpContractType}
              stakeAddr={stakeAddr}
              exchange={exchange}
            />
          )
        })}
        <ThorchainLPCard />
      </Box>
    </div>
  )
}

export default Stake
