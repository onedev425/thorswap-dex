import { StatsType } from 'components/Stats'

import { BreakPoint } from 'hooks/useWindowSize'

export const STATS_DATA: StatsType[] = [
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
]

export const columns = [
  {
    Header: 'Address',
    accessor: 'address',
  },
  {
    Header: 'Version',
    accessor: 'version',
    minScreenSize: BreakPoint.lg,
  },
  {
    Header: 'IP',
    accessor: 'ip',
    minScreenSize: BreakPoint.md,
  },
  {
    Header: 'Rewards',
    accessor: 'rewards',
  },
  {
    Header: 'Slash',
    accessor: 'slash',
  },
  {
    Header: 'Bond',
    accessor: 'bond',
  },
  {
    Header: 'Active Block',
    accessor: 'activeBlock',
    minScreenSize: BreakPoint.md,
  },
  {
    Header: 'Action',
    accessor: 'action',
    minScreenSize: BreakPoint.lg,
  },
]

export const data = [
  {
    address: 'thor12321845sdf',
    version: '0.76.0',
    ip: '11.10.7.6',
    rewards: '980',
    slash: '4500',
    bond: '3.798.153',
    activeBlock: '3.798.153',
    action: '-',
  },
  {
    address: 'thor17565859sdf',
    version: '0.78.0',
    ip: '13.10.5.9',
    rewards: '654',
    slash: '31500',
    bond: '2.798.153',
    activeBlock: '1.478.897',
    action: '-',
  },
  {
    address: 'thor12345859sdf',
    version: '0.71.0',
    ip: '12.19.7.8',
    rewards: '988',
    slash: '1500',
    bond: '1.478.897',
    activeBlock: '2.798.153',
    action: '-',
  },
]

export const buttons = [
  {
    name: 'Active',
  },
  {
    name: 'Standby',
  },
  {
    name: 'Disabled',
  },
]
