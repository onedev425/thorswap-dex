import { useTable, useSortBy } from 'react-table'

import { TableHeaderGroup } from './TableHeaderGroup'
import { TableRow } from './TableRow'
import {
  TableColumns,
  TableData,
  TableHeaderGroupType,
  TableRowType,
} from './types'

export type TableProps = {
  data: TableData[]
  columns: TableColumns
  sortable?: boolean
}

export const Table = (props: TableProps) => {
  const { columns, data, sortable } = props

  const table = useTable({ columns, data, disableSortBy: !sortable }, useSortBy)
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table

  return (
    <table className="border-separate border-spacing-y-4" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup: TableHeaderGroupType) => (
          <TableHeaderGroup
            key={headerGroup.getHeaderGroupProps().key}
            headerGroup={headerGroup}
          />
        ))}
      </thead>
      <tbody {...getTableBodyProps}>
        {rows.map((row: TableRowType) => {
          prepareRow(row)
          return <TableRow key={row.getRowProps().key} row={row} />
        })}
      </tbody>
    </table>
  )
}
