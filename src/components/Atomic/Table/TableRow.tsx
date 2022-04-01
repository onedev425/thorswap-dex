import { memo } from 'react'

import classNames from 'classnames'

import { TableCell } from './TableCell'
import { TableCellType, TableRowType } from './types'

type Props = {
  row: TableRowType
  onRowClick?: (row: TableRowType) => void
}

export const TableRow = memo(({ row, onRowClick }: Props) => {
  return (
    <tr
      {...row.getRowProps()}
      className={classNames(
        'drop-shadow-box hover:brightness-90 hover:dark:brightness-110',
        { 'cursor-pointer': onRowClick },
      )}
      onClick={() => onRowClick?.(row)}
    >
      {row.cells.map((cell: TableCellType) => (
        <TableCell key={cell.getCellProps().key} cell={cell} />
      ))}
    </tr>
  )
})
