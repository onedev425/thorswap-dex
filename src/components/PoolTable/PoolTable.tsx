import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Pool, Amount, Percent } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { AssetIcon } from 'components/AssetIcon'
import {
  TableColumnsConfig,
  Table,
  Typography,
  Button,
  Box,
} from 'components/Atomic'
import { PoolTableProps } from 'components/PoolTable/types'

import { useGlobalState } from 'redux/hooks'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const PoolTable = ({ data }: PoolTableProps) => {
  const navigate = useNavigate()
  const { runeToCurrency } = useGlobalState()

  const columns = useMemo(() => {
    return [
      {
        id: 'Pool',
        Header: 'Pool',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) => (
          <div className="flex flex-row items-center">
            <AssetIcon asset={value.asset} size={40} />
            <Typography className="hidden pl-4 h4 md:block">
              {value.asset.ticker}
            </Typography>
          </div>
        ),
      },
      {
        id: 'Network',
        Header: 'Network',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) =>
          chainToString(value.asset.chain),
        minScreenSize: BreakPoint.lg,
      },
      {
        id: 'price',
        Header: 'USD Price',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) =>
          `$${Amount.fromAssetAmount(value.detail.assetPriceUSD, 8).toFixed(
            3,
          )}`,
      },
      {
        id: 'Liquidity',
        Header: 'Liquidity',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) =>
          runeToCurrency(
            Amount.fromMidgard(value.detail.runeDepth).mul(2),
          ).toCurrencyFormat(2),
      },
      {
        id: 'volume24h',
        Header: 'Volume24H',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) =>
          runeToCurrency(
            Amount.fromMidgard(value.detail.volume24h),
          ).toCurrencyFormat(2),
        minScreenSize: BreakPoint.lg,
      },
      {
        id: 'APY',
        Header: 'APY',
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) => {
          return (
            <Box className="justify-end md:justify-start">{`${new Percent(
              value.detail.poolAPY,
            ).toFixed(0)}`}</Box>
          )
        },
      },
      {
        Header: 'Action',
        Cell: () => (
          <Box row className="gap-2" justify="end">
            <Button
              variant="secondary"
              type="outline"
              onClick={() => navigate(ROUTES.Swap)}
            >
              {t('common.swap')}
            </Button>
            <Button
              type="outline"
              onClick={() => navigate(ROUTES.AddLiquidity)}
            >
              {t('common.addLiquidity')}
            </Button>
          </Box>
        ),
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
      },
    ] as TableColumnsConfig
  }, [navigate, runeToCurrency])

  return (
    <div className="flex flex-col">
      <Table columns={columns} data={data} sortable />
    </div>
  )
}
