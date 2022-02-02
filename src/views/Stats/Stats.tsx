import { Chart } from 'components/Chart'
import { StatsGroup } from 'components/StatsGroup'
import { Typography } from 'components/Typography'

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
  return (
    <div className="flex flex-wrap">
      <div className="grid grid-cols-3 gap-8 mb-16">
        <div>
          <div className="flex flex-row pb-8">
            <Typography variant="h3" color="primary" fontWeight="extrabold">
              Volume
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              Total Vol
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="red"
              fontWeight="semibold"
            >
              -13.29%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
              Liquidity
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              Liquidity APY
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              7.51%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
              Users
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              SWAP Count
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              34.76%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
              Network
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              Totoal Value Locked (TVL)
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              3.69%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
              Rewards
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              Daily Block Rewards
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="red"
              fontWeight="semibold"
            >
              -8.27%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
              Transactions
            </Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="secondary"
              fontWeight="semibold"
            >
              Total Transactions
            </Typography>
            <Typography
              className="group-hover:text-white dark:group-hover:text-white"
              variant="h5"
              color="green"
              fontWeight="semibold"
            >
              4.91%
            </Typography>
          </div>
          <div className="flex flex-row pb-8">
            <Chart type="curved-line" data={sampleData} />
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
