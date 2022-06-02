import { useCallback } from 'react'

import { Pool } from '@thorswap-lib/multichain-sdk'

import { Table, TableRowType } from 'components/Atomic'

import {
  getPoolDetailRouteFromAsset,
  navigateToExternalLink,
} from 'settings/constants'

import { usePoolColumns } from './usePoolColumns'

const initialSort = [{ id: 'liquidity', desc: true }]

type Props = {
  data: Pool[]
}

export const PoolTable = ({ data }: Props) => {
  const navigateToPoolInfo = useCallback(({ original }: TableRowType) => {
    navigateToExternalLink(getPoolDetailRouteFromAsset(original.asset))
  }, [])

  const columns = usePoolColumns()

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
