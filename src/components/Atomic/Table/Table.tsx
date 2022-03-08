import { useEffect, useMemo } from 'react'

import { useTable, useSortBy } from 'react-table'

import useWindowSize from 'hooks/useWindowSize'

import { TableHeaderGroup } from './TableHeaderGroup'
import { TableRow } from './TableRow'
import {
  InitialTableSort,
  TableColumnsConfig,
  TableData,
  TableHeaderGroupType,
  TableRowType,
} from './types'

export type TableProps = {
  data: TableData[]
  columns: TableColumnsConfig
  sortable?: boolean
  initialSort?: InitialTableSort
}

export const Table = ({
  columns: columnsConfig,
  data,
  sortable,
  initialSort,
}: TableProps) => {
  const { isVisible } = useWindowSize()
  const sortBy = useMemo(() => initialSort, [initialSort])
  const table = useTable(
    {
      columns: columnsConfig,
      data,
      disableSortBy: !sortable,
      initialState: {
        sortBy,
      },
    },
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
    <table className="border-separate border-spacing-y-1" {...getTableProps()}>
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
