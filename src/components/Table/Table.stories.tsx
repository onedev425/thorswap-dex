import { ComponentMeta } from '@storybook/react'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'

import { Table } from './Table'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Table',
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table>

const columns = [
  {
    Header: 'Asset',
    accessor: 'asset',
    Cell: ({ cell: { value } }: FixMe) => <Icon name={value.icon} size={40} />,
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
  },
  {
    Header: 'Transaction hash',
    accessor: 'hash',
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: () => (
      <Row className="gap-2" justify="end">
        <Button variant="tertiary" type="outline">
          send
        </Button>
        <Button variant="secondary" type="outline">
          receive
        </Button>
        <Button type="outline">swap</Button>
      </Row>
    ),
    disableSortBy: true,
  },
]

const data = [
  {
    asset: { name: 'BTC', icon: 'bitcoin' },
    type: 'Send',
    date: '18/1/2022',
    recipient: 'ad12345ajshd173634655',
    hash: '3f4njkncew3nsdD0AD',
    action: '-',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum' },
    type: 'Receive',
    date: '20/1/2022',
    recipient: 'bc12345ajshd173634655',
    hash: '1233f4njkncew3nsdD0AD0E0',
    action: '-',
  },
]

export const All = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Table columns={columns} data={data} />
    </div>
  )
}

export const Sortable = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Table columns={columns} data={data} sortable />
    </div>
  )
}
