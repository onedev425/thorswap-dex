import { memo } from 'react'

import { Row } from 'react-table'

import { TableRow } from 'components/Atomic/Table/TableRow'
import { TableRowType } from 'components/Atomic/Table/types'

import { BreakPoint } from 'hooks/useWindowSize'

type Props = {
  breakpoint: BreakPoint
  rows: Row[]
  prepareRow: (row: Row) => void
  hasShadow: boolean
  onRowClick?: (row: TableRowType) => void
}

export const TableRows = memo(
  ({ rows, prepareRow, hasShadow, onRowClick }: Props) => (
    <>
      {rows.map((row: TableRowType) => {
        prepareRow(row)
        return (
          <TableRow
            key={row.getRowProps().key}
            onRowClick={onRowClick}
            row={row}
            hasShadow={hasShadow}
          />
        )
      })}
    </>
  ),
)
