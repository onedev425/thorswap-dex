import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { StatsGroup } from 'components/StatsGroup'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

const sampleData = [
  { x: 'January', y: 90 },
  { x: 'February', y: 100 },
  { x: 'March', y: 40 },
  { x: 'April', y: 60 },
  { x: 'May', y: 180 },
  { x: 'June', y: 100 },
  { x: 'July', y: 50 },
  { x: 'August', y: 70 },
  { x: 'September', y: 80 },
  { x: 'October', y: 90 },
  { x: 'November', y: 140 },
  { x: 'December', y: 100 },
]

const Stats = () => {
  const change = '-13.29%'
  const liquidityChange = '7.51%'
  const swapChange = '34.76%'
  const tvlChange = '3.69%'
  const dbrChange = '-8.27%'
  const totalTransactionChange = '4.91%'

  return (
    <div className="flex flex-wrap">
      <div className="grid grid-cols-3 gap-8 mb-16">
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('common.volume')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {t('common.totalVol')}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="red"
              fontWeight="semibold"
            >
              {change}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="lightning"
            iconColor="pink"
            stats={[
              {
                label: 'Total Volume',
                value: '$ 2.01 B',
              },
              {
                label: 'Deposit Volume',
                value: '$ 275.63 M',
              },
              {
                label: 'Swap Volume',
                value: '$ 1.54 B',
              },
              {
                label: 'Withdraw Volume',
                value: '$ 191.86 M',
              },
            ]}
          />
        </div>
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('common.liquidity')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {t('common.liquidityAPY')}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              {liquidityChange}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="chartArea"
            iconColor="blue"
            stats={[
              {
                label: 'Total Liquidity',
                value: '$ 179.43 M',
              },
              {
                label: 'Max RUNE Liquidity',
                value: '15.5 M Rune',
              },
              {
                label: 'Upgraded RUNE',
                value: '154.2 M Rune',
              },
              {
                label: 'Liquidity APY',
                value: '13.29 %',
              },
            ]}
          />
        </div>
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('views.stats.users')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {t('views.stats.swapCount')}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              {swapChange}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="wallet"
            iconColor="green"
            stats={[
              {
                label: 'Swap Count 30D',
                value: '$ 179.43 M',
              },
              {
                label: 'Add Liquidity Count',
                value: '$509,82b',
              },
              {
                label: 'Withdraw Count',
                value: '$ 179.43 M',
              },
              {
                label: 'Dily Active Users',
                value: '$46,82.3',
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('views.stats.network')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {`${t('common.totalValueLocked')} (TVL)`}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              {tvlChange}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="fire"
            iconColor="purple"
            stats={[
              {
                label: 'TVL',
                value: '$2.10m',
              },
              {
                label: 'Total Active Bounds',
                value: '$509,82b',
              },
              {
                label: 'Total Bond',
                value: '$ 178.98 M',
              },
              {
                label: 'Bonding APY',
                value: '$ 191.86 M',
              },
            ]}
          />
        </div>
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('views.stats.rewards')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {t('views.stats.dailyBlockRewards')}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="red"
              fontWeight="semibold"
            >
              {dbrChange}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="chartPie"
            iconColor="yellow"
            stats={[
              {
                label: 'Total Reserve',
                value: '$3.650m',
              },
              {
                label: 'Daily Block Rewards',
                value: '$ 179.43 M',
              },
              {
                label: 'Daily LP Rewards',
                value: '$46,82.3',
              },
              {
                label: 'Daily Bound Rewards',
                value: '$46,667.4',
              },
            ]}
          />
        </div>
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              {t('common.transactions')}
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              {t('views.stats.dailyBlockRewards')}
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              {totalTransactionChange}
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type={ChartType.CurvedLine} data={sampleData} hideLabel />
          </div>
          <StatsGroup
            iconName="chartArea2"
            iconColor="blueLight"
            stats={[
              {
                label: 'Total Transactions',
                value: '$ 179.43 M',
              },
              {
                label: 'Swap Count',
                value: '$509,82b',
              },
              {
                label: 'Unique Swappers',
                value: '$ 179.43 M',
              },
              {
                label: 'Swap Count 24h',
                value: '$46,82.3',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Stats
