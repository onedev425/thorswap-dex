import { TableCell } from './TableCell'
import { TableCellType, TableRowType } from './types'

type Props = {
  row: TableRowType
}

export const TableRow = (props: Props) => {
  const { row } = props

  return (
    <tr
      className="drop-shadow-box hover:brightness-90 hover:dark:brightness-110"
      {...row.getRowProps()}
    >
      {row.cells.map((cell: TableCellType) => (
        <TableCell key={cell.getCellProps().key} cell={cell} />
      ))}
    </tr>
  )
}
