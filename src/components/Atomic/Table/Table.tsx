import { useEffect, useMemo } from 'react'

import { useTable, useSortBy } from 'react-table'

import classNames from 'classnames'

import { Icon } from 'components/Atomic'

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
  loading?: boolean
  initialSort?: InitialTableSort
  onRowClick?: (row: TableRowType) => void
}

export const Table = ({
  columns: columnsConfig,
  data,
  sortable,
  loading,
  initialSort,
  onRowClick,
}: TableProps) => {
  const { isSizeActive } = useWindowSize()
  const sortBy = useMemo(() => initialSort, [initialSort])
  const table = useTable(
    {
      columns: columnsConfig,
      data,
      disableSortBy: !sortable,
      initialState: {
        sortBy: initialSort ? sortBy : [],
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
      .filter((_, i) => !isSizeActive(columnsConfig[i].minScreenSize))
      .map((column) => column.id)

    setHiddenColumns(hidden)
  }, [columns, columnsConfig, isSizeActive, setHiddenColumns])

  return (
    <table
      className="border-separate border-spacing-y-1 relative"
      {...getTableProps()}
    >
      {loading && (
        <div className="absolute z-10 w-full justify-center flex mt-[80px]">
          <Icon name="refresh" color="primaryBtn" spin size={16} />
        </div>
      )}

      <thead>
        {headerGroups.map((headerGroup: TableHeaderGroupType) => (
          <TableHeaderGroup
            key={headerGroup.getHeaderGroupProps().key}
            headerGroup={headerGroup}
          />
        ))}
      </thead>

      <tbody
        {...getTableBodyProps()}
        className={classNames({
          'opacity-30': loading,
        })}
      >
        {rows.map((row: TableRowType) => {
          prepareRow(row)
          return (
            <TableRow
              key={row.getRowProps().key}
              onRowClick={onRowClick}
              row={row}
            />
          )
        })}
      </tbody>
    </table>
  )
}
