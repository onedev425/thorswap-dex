import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { PoolTableProps } from 'components/PoolTable/types'
import { Row } from 'components/Row'
import { Table } from 'components/Table'
import { TableColumns } from 'components/Table/types'
import { Typography } from 'components/Typography'

const getPoolColumns = () => {
  return [
    {
      Header: 'Pool',
      accessor: 'asset',
      Cell: ({ cell: { value } }: FixMe) => (
        <div className="flex flex-row items-center">
          <Icon name={value.icon} color={value.iconColor} size={40} />
          <Typography className="pl-4 h4">{value.name}</Typography>
        </div>
      ),
      disableSortBy: true,
    },
    {
      Header: 'Network',
      accessor: 'network',
      disableSortBy: true,
    },
    {
      Header: 'USD Price',
      accessor: 'price',
      disableSortBy: true,
    },
    {
      Header: 'Liquidity',
      accessor: 'liquidity',
    },
    {
      Header: '24h Vol',
      accessor: 'volume',
      disableSortBy: true,
    },
    {
      Header: 'APY',
      accessor: 'apy',
      disableSortBy: true,
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: () => (
        <Row className="gap-2" justify="end">
          <Button bgColor="secondary" outline onClick={() => {}}>
            Swap
          </Button>
          <Button bgColor="primary" outline onClick={() => {}}>
            Add Liquidity
          </Button>
        </Row>
      ),
      disableSortBy: true,
    },
  ] as TableColumns
}
export const PoolTable = ({ data }: PoolTableProps) => {
  const columns = getPoolColumns()
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary">
      <Table columns={columns} data={data} sortable />
    </div>
  )
}
