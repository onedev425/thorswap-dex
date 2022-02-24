import {
  TableColumnsConfig,
  Table,
  Typography,
  Icon,
  Button,
  Box,
} from 'components/Atomic'
import { PoolTableProps } from 'components/PoolTable/types'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

const getPoolColumns = () => {
  return [
    {
      Header: 'Pool',
      accessor: 'asset',
      Cell: ({ cell: { value } }: FixMe) => (
        <div className="flex flex-row items-center">
          <Icon name={value.icon} color={value.iconColor} size={40} />
          <Typography className="pl-4 h4 hidden md:block">
            {value.name}
          </Typography>
        </div>
      ),
      disableSortBy: true,
    },
    {
      Header: 'Network',
      accessor: 'network',
      disableSortBy: true,
      minScreenSize: BreakPoint.lg,
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
      minScreenSize: BreakPoint.lg,
    },
    {
      Header: 'APY',
      accessor: 'apy',
      disableSortBy: true,
      Cell: ({ cell }) => {
        return <Box className="justify-end md:justify-start">{cell.value}</Box>
      },
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: () => (
        <Box row className="gap-2" justify="end">
          <Button variant="secondary" type="outline" onClick={() => {}}>
            {t('common.swap')}
          </Button>
          <Button type="outline" onClick={() => {}}>
            {t('common.addLiquidity')}
          </Button>
        </Box>
      ),
      disableSortBy: true,
      minScreenSize: BreakPoint.md,
    },
  ] as TableColumnsConfig
}
export const PoolTable = ({ data }: PoolTableProps) => {
  const columns = getPoolColumns()

  return (
    <div className="flex flex-col">
      <Table columns={columns} data={data} sortable />
    </div>
  )
}
