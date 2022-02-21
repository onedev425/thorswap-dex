import { TableHeaderColumn } from './TableHeaderColumn'
import { TableHeaderGroupType } from './types'

type Props = {
  headerGroup: TableHeaderGroupType
}

export const TableHeaderGroup = (props: Props) => {
  const { headerGroup } = props

  return (
    <tr className="text-left" {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column: TableHeaderGroupType) => (
        <TableHeaderColumn key={column.getHeaderProps().key} column={column} />
      ))}
    </tr>
  )
}
