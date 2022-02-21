import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Chart } from 'components/Chart'
import { ChartType } from 'components/Chart/types'
import { Icon } from 'components/Icon'
import { Input } from 'components/Input'
import { PieChart } from 'components/PieChart'
import { PieChartData } from 'components/PieChart/types'
import { Row } from 'components/Row'
import { Select } from 'components/Select'
import { Statistics } from 'components/Statistics'
import { Table } from 'components/Table'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

import { BreakPoint } from '../../hooks/useWindowSize'

const Wallet = () => {
  const token = { name: 'Bitcoin', ticker: 'BTC', change: '+10% ($ 1.500)' }
  return (
    <div className="container">
      <Box className="pb-8 sm:pb-0 gap-6 xl:flex-row" col>
        <Box className="w-full xl:w-1/2" col>
          <Box className="pb-8">
            <Statistics
              amount={100.34554}
              change={-9}
              title="Total Balance"
              value={2890.0}
            />
          </Box>
          <Box className="pb-8">
            <AssetIcon bgColor="orange" name="BTC" />
            <Box alignCenter>
              <Typography variant="h5" className="ml-4" fontWeight="normal">
                {token.name}
              </Typography>
              <Typography variant="h5" className="ml-1" fontWeight="normal">
                {`(${token.ticker})`}
              </Typography>
              <Typography
                variant="h5"
                className="ml-1"
                fontWeight="normal"
                color="green"
              >
                {token.change}
              </Typography>
            </Box>
          </Box>
          <Box className="pb-4">
            <Chart
              className="min-h-[189px]"
              type={ChartType.CurvedLine}
              data={sampleData}
            />
          </Box>
        </Box>
        <Box
          className="w-full xl:w-1/2 sm:justify-items-start sm:flex-row sm:pb-8"
          col
        >
          <Box justifyCenter col className="w-[260px]">
            <Box className="pb-4">
              <Typography variant="h3">
                {t('views.wallet.yourAssets')}
              </Typography>
            </Box>
            <Box className="hidden sm:flex">
              <PieChart data={pieData} />
            </Box>
          </Box>
          <div className="flex flex-col justify-center w-full xl:w-3/5 sm:ml-[20px]">
            <Table data={assetsTableData} columns={AssetsColumns} sortable />
          </div>
        </Box>
      </Box>
      <Box col className="pb-16">
        <Row justify="between">
          <Box
            className="flex-wrap gap-4 md:flex-row md:justify-between flex-1"
            col
          >
            <Box>
              <Typography variant="h3">
                {t('views.wallet.managePortfolio')}
              </Typography>
              <Typography
                variant="h3"
                className="ml-1"
                fontWeight="light"
                color="secondary"
              >
                {'(3)'}
              </Typography>
            </Box>
            <Box
              className="gap-4 md:flex-grow md:flex-row md:justify-between"
              col
            >
              <Box>
                <Input placeholder="Search" icon="search" />
              </Box>
              <Box>
                <Select options={['Show All Tokens', 'Disconnect']} />
              </Box>
            </Box>
          </Box>
        </Row>
        <Table data={TableAllocationData} columns={TableAllocationColumns} />
      </Box>
      <Box col>
        <Row justify="between">
          <Box
            className="flex-wrap gap-4 md:flex-row md:justify-between flex-1"
            col
          >
            <Box>
              <Typography variant="h3">
                {t('views.wallet.transactionHistory')}
              </Typography>
              <Typography
                variant="h3"
                className="ml-1"
                fontWeight="light"
                color="secondary"
              >
                {'(3)'}
              </Typography>
            </Box>
            <Box
              className="gap-4 md:flex-grow md:flex-row md:justify-between"
              col
            >
              <Box>
                <Input placeholder="Search" icon="search" />
              </Box>
            </Box>
          </Box>
        </Row>
        <Table
          data={TableTransactionsData}
          columns={TableTransactionsColumns}
        />
      </Box>
    </div>
  )
}

export default Wallet

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
const TableAllocationData = [
  {
    asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
    price: '$ 1.500',
    allocation: '10%',
    amount: '$ 100.34554',
    address: '3f4njkncew3nsdD0AD0E0A69CD',
    action: '-',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
    price: '$ 1.500',
    allocation: '10%',
    amount: '$ 100.34554',
    address: '3f4njkncew3nsdD0AD0E0A69CD',
    action: '-',
  },
]
const TableTransactionsData = [
  {
    asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
    type: 'SEND',
    date: '18/1/2022',
    recipient: 'ad12345ajshd173634655',
    hash: '3f4njkncew3nsdD0AD',
    action: '-',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
    type: 'RECEIVE',
    date: '20/1/2022',
    recipient: 'bc12345ajshd173634655',
    hash: '1233f4njkncew3nsdD0AD0E0',
    action: '-',
  },
]

const TableAllocationColumns = [
  {
    Header: 'Asset',
    accessor: 'asset',
    Cell: ({ cell: { value } }: FixMe) => (
      <div className="flex items-center gap-2">
        <AssetIcon name={value.name} size={40} />
        <Typography color="secondary">{value.name}</Typography>
      </div>
    ),
    disableSortBy: true,
  },
  {
    Header: 'Price',
    accessor: 'price',
  },
  {
    Header: 'Allocation',
    accessor: 'allocation',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Address',
    accessor: 'address',
    minScreenSize: BreakPoint.lg,
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: () => (
      <Row className="gap-2" justify="end">
        <Button variant="tertiary" type="outline">
          {t('common.send')}
        </Button>
        <Button type="outline">{t('common.receive')}</Button>
        <Button variant="secondary" type="outline">
          {t('common.swap')}
        </Button>
      </Row>
    ),
    minScreenSize: BreakPoint.lg,
    disableSortBy: true,
  },
]

const TableTransactionsColumns = [
  {
    Header: 'Asset',
    accessor: 'asset',
    Cell: ({ cell: { value } }: FixMe) => (
      <div className="flex items-center gap-2">
        <AssetIcon name={value.name} size={40} />
        <Typography color="secondary">{value.name}</Typography>
      </div>
    ),
    disableSortBy: true,
  },
  {
    Header: 'Type',
    accessor: 'type',
  },
  {
    Header: 'Date',
    accessor: 'date',
  },
  {
    Header: 'Recipient address',
    accessor: 'recipient',
    minScreenSize: BreakPoint.lg,
  },
  {
    Header: 'Transaction hash',
    accessor: 'hash',
    minScreenSize: BreakPoint.lg,
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: () => (
      <Row className="justify-end">
        <Icon name="share" onClick={() => {}} />
      </Row>
    ),
    disableSortBy: true,
  },
]

const pieData: PieChartData[] = [
  {
    value: 25,
    backgroundColor: '#FFB359',
    hoverBackgroundColor: '#cca445',
    themeBg: 'bg-yellow',
    iconName: 'bitcoin',
    iconColor: 'yellow',
  },
  {
    value: 40,
    backgroundColor: '#2A7DFA',
    hoverBackgroundColor: '#2671a5',
    themeBg: 'bg-blue',
    iconName: 'lightning',
    iconColor: 'blue',
  },
  {
    value: 35,
    backgroundColor: '#7B48E8',
    hoverBackgroundColor: '#52309b',
    themeBg: 'bg-purple',
    iconName: 'lightning',
    iconColor: 'purple',
  },
]

const AssetsColumns = [
  {
    Header: 'Asset',
    accessor: 'asset',
    Cell: ({ cell: { value } }: FixMe) => (
      <div className="flex items-center gap-2">
        <AssetIcon name={value.name} size={40} />
        <Typography color="secondary">{value.name}</Typography>
      </div>
    ),
    disableSortBy: true,
  },

  {
    Header: 'Amount %',
    accessor: 'amount',
  },
  {
    Header: 'Allocation',
    accessor: 'allocation',
  },
]

const assetsTableData = [
  {
    asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
    amount: '0.05',
    allocation: '30 %',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
    amount: '3.42305',
    allocation: '320 %',
  },
  {
    asset: { name: 'BNB', icon: 'binance', iconColor: 'orange' },
    amount: '12.534805',
    allocation: '303 %',
  },
]
