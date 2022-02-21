import { IconName } from 'components/Atomic'
import { DataPoint } from 'components/Chart/types'
import { PoolData } from 'components/PoolTable/types'
import { StatsType } from 'components/Stats'

import { ColorType } from 'types/global'

type DashboardStatistics = {
  amount: number
  change: number
  value: number
  chartData: DataPoint[]
}

type DashboardMockData = {
  statsList: StatsType[]
  stats: {
    liquidity: DashboardStatistics
    volume: DashboardStatistics
  }
  featuredPools: {
    ticker: string
    price: number
    color: ColorType
    iconName: IconName
    change: number
  }[]
  pools: PoolData[]
}

export const dashboardMockData: DashboardMockData = {
  statsList: [
    {
      iconName: 'chartPie',
      color: 'yellow',
      label: '24h Volume',
      value: '$46,82.56',
    },
    {
      iconName: 'chartArea',
      color: 'purple',
      label: 'Total Liquidity',
      value: '$509,82b',
    },
    {
      iconName: 'chartCandle',
      color: 'blue',
      label: 'Liquidity APY',
      value: '100,50%',
    },
    {
      iconName: 'refresh',
      color: 'blueLight',
      label: 'Transactions',
      value: '$46,82.3',
    },
    { iconName: 'wifi', color: 'red', label: 'Total Fees', value: '$46,82.56' },
    {
      iconName: 'chartArea2',
      color: 'green',
      label: 'IL Paid',
      value: '$46,82.56',
    },
    {
      iconName: 'lightning',
      color: 'pink',
      label: 'Total Vol',
      value: '$46,82.3',
    },
    {
      iconName: 'fire',
      color: 'blueLight',
      label: 'Funds Cap (i)',
      value: '100.2%',
    },
  ],
  stats: {
    volume: {
      amount: 103000.69,
      change: -4,
      value: 2890,
      chartData: [
        { x: 'Sep 1', y: 0 },
        { x: 'Sep 2', y: 30 },
        { x: 'Sep 3', y: 25 },
        { x: 'Sep 4', y: 40 },
        { x: 'Sep 5', y: 60 },
        { x: 'Sep 6', y: 55 },
        { x: 'Sep 7', y: 50 },
        { x: 'Sep 8', y: 40 },
        { x: 'Sep 9', y: 20 },
        { x: 'Sep 10', y: 60 },
        { x: 'Sep 11', y: 90 },
        { x: 'Sep 12', y: 100 },
        { x: 'Sep 13', y: 95 },
        { x: 'Sep 14', y: 75 },
        { x: 'Sep 15', y: 60 },
        { x: 'Sep 16', y: 35 },
        { x: 'Sep 17', y: 80 },
        { x: 'Sep 18', y: 110 },
        { x: 'Sep 19', y: 100 },
        { x: 'Sep 20', y: 90 },
        { x: 'Sep 21', y: 40 },
        { x: 'Sep 22', y: 30 },
        { x: 'Sep 23', y: 10 },
        { x: 'Sep 24', y: 20 },
        { x: 'Sep 26', y: 30 },
        { x: 'Sep 27', y: 28 },
        { x: 'Sep 28', y: 26 },
        { x: 'Sep 29', y: 20 },
        { x: 'Sep 30', y: 10 },
        { x: 'Oct 1', y: 30 },
        { x: 'Oct 2', y: 40 },
        { x: 'Oct 3', y: 80 },
        { x: 'Oct 4', y: 90 },
        { x: 'Oct 5', y: 40 },
        { x: 'Oct 6', y: 50 },
        { x: 'Oct 7', y: 30 },
        { x: 'Oct 8', y: 60 },
        { x: 'Oct 9', y: 20 },
        { x: 'Oct 10', y: 10 },
      ],
    },
    liquidity: {
      amount: 2000.04,
      change: 12.3,
      value: 1003,
      chartData: [
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
      ],
    },
  },
  featuredPools: [
    {
      ticker: 'btc',
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: 5,
    },
    {
      ticker: 'eth',
      price: 2800,
      color: 'purple',
      iconName: 'ethereum',
      change: -1.5,
    },
    {
      ticker: 'bnb',
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: 1.5,
    },
    {
      ticker: 'usdt',
      price: 1,
      color: 'blue',
      iconName: 'usdt',
      change: -0.5,
    },
  ],
  pools: [
    {
      asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
      network: 'Bitcoin',
      price: '$ 50.000',
      liquidity: '$63.07m',
      volume: '$6.27m',
      apy: '17%',
      action: '-',
    },
    {
      asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
      network: 'Bitcoin',
      price: '$ 50.000',
      liquidity: '$62.07m',
      volume: '$6.27m',
      apy: '17%',
      action: '-',
    },
    {
      asset: { name: 'BNB', icon: 'binance', iconColor: 'yellow' },
      network: 'Binance',
      price: '$ 50.000',
      liquidity: '$61.07m',
      volume: '$6.27m',
      apy: '17%',
      action: '-',
    },
  ],
}
