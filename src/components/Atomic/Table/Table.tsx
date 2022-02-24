import { useEffect } from 'react'

import { useTable, useSortBy } from 'react-table'

import useWindowSize from 'hooks/useWindowSize'

import { TableHeaderGroup } from './TableHeaderGroup'
import { TableRow } from './TableRow'
import {
  TableColumnsConfig,
  TableData,
  TableHeaderGroupType,
  TableRowType,
} from './types'

export type TableProps = {
  data: TableData[]
  columns: TableColumnsConfig
  sortable?: boolean
}

export const Table = ({
  columns: columnsConfig,
  data,
  sortable,
}: TableProps) => {
  const { isVisible } = useWindowSize()
  const table = useTable(
    { columns: columnsConfig, data, disableSortBy: !sortable },
    useSortBy,
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
    columns,
  } = table

  useEffect(() => {
    const hidden = columns
      .filter((_, i) => !isVisible(columnsConfig[i].minScreenSize))
      .map((column) => column.id)

    setHiddenColumns(hidden)
  }, [columns, columnsConfig, isVisible, setHiddenColumns])

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

      <tbody {...getTableBodyProps()}>
        {rows.map((row: TableRowType) => {
          prepareRow(row)
          return <TableRow key={row.getRowProps().key} row={row} />
        })}
      </tbody>
    </table>
  )
}
