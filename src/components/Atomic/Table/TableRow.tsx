import classNames from 'classnames'

import { TableCell } from './TableCell'
import { TableCellType, TableRowType } from './types'

type Props = {
  row: TableRowType
  onRowClick?: Function
}

export const TableRow = ({ row, onRowClick = () => {} }: Props) => {
  return (
    <tr
      className={classNames(
        'drop-shadow-box hover:brightness-90 hover:dark:brightness-110',
        { 'cursor-pointer': onRowClick },
      )}
      {...row.getRowProps()}
      onClick={() => onRowClick(row)}
    >
      {row.cells.map((cell: TableCellType) => (
        <TableCell key={cell.getCellProps().key} cell={cell} />
      ))}
    </tr>
  )
}
