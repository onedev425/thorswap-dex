import { ComponentMeta } from '@storybook/react'

import { PoolTable } from './PoolTable'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PoolTable',
  component: PoolTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PoolTable>

const data: FixMe[] = [
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
]

export const Table = () => {
  return <PoolTable data={data} />
}
