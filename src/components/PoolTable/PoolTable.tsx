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
import {
  sortApyColumn,
  sortLiquidityColumn,
  sortPoolColumn,
  sortPriceColumn,
  sortVolume24Column,
} from 'components/PoolTable/utils'

import { useGlobalState } from 'redux/hooks'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { ROUTES } from 'settings/constants'

const initialSort = [{ id: 'liquidity', desc: true }]

export const PoolTable = ({ data }: PoolTableProps) => {
  const navigate = useNavigate()
  const { runeToCurrency } = useGlobalState()

  const columns = useMemo(
    () =>
      [
        {
          id: 'pool',
          Header: 'Pool',
          accessor: (row: Pool) => row,
          Cell: ({ cell: { value } }: { cell: { value: Pool } }) => (
            <div className="flex flex-row items-center">
              <AssetIcon asset={value.asset} hasChainIcon size={40} />
              <Typography className="hidden pl-4 h4 md:block">
                {value.asset.ticker}
              </Typography>
            </div>
          ),
          sortType: sortPoolColumn,
        },
        {
          id: 'network',
          Header: 'Network',
          accessor: (row: Pool) => chainToString(row.asset.chain),
          minScreenSize: BreakPoint.lg,
        },
        {
          id: 'price',
          Header: 'USD Price',
          accessor: (row: Pool) =>
            Amount.fromAssetAmount(row.detail.assetPriceUSD, 8),
          align: 'right',
          Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
            formatPrice(value),
          sortType: sortPriceColumn,
        },
        {
          id: 'liquidity',
          Header: 'Liquidity',
          accessor: (row: Pool) =>
            Amount.fromMidgard(row.detail.runeDepth).mul(2),
          align: 'right',
          Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
            runeToCurrency(value).toCurrencyFormat(2),
          sortType: sortLiquidityColumn,
        },
        {
          id: 'volume24h',
          Header: 'Volume24H',
          accessor: (row: Pool) => Amount.fromMidgard(row.detail.volume24h),
          align: 'right',
          Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
            runeToCurrency(value).toCurrencyFormat(2),
          minScreenSize: BreakPoint.lg,
          sortType: sortVolume24Column,
        },
        {
          id: 'apy',
          Header: 'APY',
          accessor: (row: Pool) => new Percent(row.detail.poolAPY),
          align: 'right',
          Cell: ({ cell: { value } }: { cell: { value: Percent } }) =>
            value.toFixed(0),
          sortType: sortApyColumn,
        },
        {
          Header: 'Action',
          Cell: ({ row: { original } }) => (
            <Box row className="gap-2" justify="end">
              <Button
                variant="secondary"
                type="outline"
                onClick={() =>
                  navigate(`${ROUTES.Swap}?input=${original.asset}`)
                }
              >
                {t('common.swap')}
              </Button>
              <Button
                type="outline"
                onClick={() =>
                  navigate(`${ROUTES.AddLiquidity}?input=${original.asset}`)
                }
              >
                {t('common.addLiquidity')}
              </Button>
            </Box>
          ),
          disableSortBy: true,
          minScreenSize: BreakPoint.md,
        },
      ] as TableColumnsConfig,
    [navigate, runeToCurrency],
  )

  return (
    <div className="flex flex-col">
      <Table columns={columns} data={data} sortable initialSort={initialSort} />
    </div>
  )
}
