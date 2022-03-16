import { TableCell } from './TableCell'
import { TableCellType, TableRowType } from './types'

type Props = {
  row: TableRowType
  onRowClick?: Function
}

export const TableRow = ({ row, onRowClick = () => {} }: Props) => {
  return (
    <tr
      className="drop-shadow-box hover:brightness-90 hover:dark:brightness-110"
      {...row.getRowProps()}
      onClick={() => onRowClick(row.index)}
    >
      {row.cells.map((cell: TableCellType) => (
        <TableCell key={cell.getCellProps().key} cell={cell} />
      ))}
    </tr>
  )
}
