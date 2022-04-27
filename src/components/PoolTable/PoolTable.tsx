import { useCallback, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Pool, Amount, Percent } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { AssetIcon } from 'components/AssetIcon'
import { Table, Typography, Button, Box, TableRowType } from 'components/Atomic'
import { PoolTableProps } from 'components/PoolTable/types'
import {
  sortApyColumn,
  sortLiquidityColumn,
  sortPoolColumn,
  sortPriceColumn,
  sortVolume24Column,
} from 'components/PoolTable/utils'

import { useGlobalState } from 'store/hooks'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import {
  getAddLiquidityRoute,
  getPoolDetailRouteFromAsset,
  getSwapRoute,
  navigateToExternalLink,
} from 'settings/constants'

const initialSort = [{ id: 'liquidity', desc: true }]

export const PoolTable = ({ data }: PoolTableProps) => {
  const navigate = useNavigate()
  const { runeToCurrency } = useGlobalState()

  const navigateToPoolInfo = useCallback(({ original }: TableRowType) => {
    navigateToExternalLink(getPoolDetailRouteFromAsset(original.asset))
  }, [])

  const columns = useMemo(
    () => [
      {
        id: 'pool',
        Header: () => t('common.pool'),
        accessor: (row: Pool) => row,
        sortType: sortPoolColumn,
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
        id: 'network',
        Header: () => t('common.network'),
        accessor: (row: Pool) => chainToString(row.asset.chain),
        minScreenSize: BreakPoint.xl,
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        accessor: (row: Pool) =>
          Amount.fromAssetAmount(row.detail.assetPriceUSD, 8),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
          formatPrice(value),
        sortType: sortPriceColumn,
      },
      {
        id: 'liquidity',
        Header: () => t('common.liquidity'),
        accessor: (row: Pool) =>
          Amount.fromMidgard(row.detail.runeDepth).mul(2),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
          runeToCurrency(value).toCurrencyFormat(2),
        sortType: sortLiquidityColumn,
      },
      {
        id: 'volume24h',
        Header: () => t('common.24Volume'),
        accessor: (row: Pool) => Amount.fromMidgard(row.detail.volume24h),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
          runeToCurrency(value).toCurrencyFormat(2),
        minScreenSize: BreakPoint.lg,
        sortType: sortVolume24Column,
      },
      {
        id: 'apy',
        Header: () => t('common.APY'),
        accessor: (row: Pool) => new Percent(row.detail.poolAPY),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Percent } }) =>
          value.toFixed(0),
        sortType: sortApyColumn,
      },
      {
        id: 'action',
        Header: () => t('common.action'),
        accessor: (row: Pool) => row,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              variant="secondary"
              type="outline"
              onClick={(e) => {
                e.stopPropagation()
                navigate(getSwapRoute(value.asset))
              }}
            >
              {t('common.swap')}
            </Button>
            <Button
              type="outline"
              onClick={(e) => {
                e.stopPropagation()
                navigate(getAddLiquidityRoute(value.asset))
              }}
            >
              {t('common.addLiquidity')}
            </Button>
          </Box>
        ),
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
      },
    ],
    [navigate, runeToCurrency],
  )

  return (
    <div className="flex flex-col">
      <Table
        onRowClick={navigateToPoolInfo}
        // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
        columns={columns}
        data={data}
        sortable
        initialSort={initialSort}
      />
    </div>
  )
}
