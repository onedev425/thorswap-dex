import { ComponentMeta } from '@storybook/react'

import { FixmeType } from 'types/global'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { Row } from '../Row'
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
    Cell: ({ cell: { value } }: FixmeType) => (
      <Icon name={value.icon} size={40} />
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
        <Button bgColor="purple" outline>
          send
        </Button>
        <Button bgColor="blue" outline>
          receive
        </Button>
        <Button bgColor="green" outline>
          swap
        </Button>
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
