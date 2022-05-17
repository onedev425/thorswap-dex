import { useCallback } from 'react'

import { Table, TableRowType } from 'components/Atomic'
import { PoolTableProps } from 'components/PoolTable/types'
import { usePoolColumns } from 'components/PoolTable/usePoolColumns'

import {
  getPoolDetailRouteFromAsset,
  navigateToExternalLink,
} from 'settings/constants'

const initialSort = [{ id: 'liquidity', desc: true }]

export const PoolTable = ({ data }: PoolTableProps) => {
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
