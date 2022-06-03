import { useEffect, useMemo } from 'react'

import { useTable, useSortBy } from 'react-table'

import classNames from 'classnames'

import { Icon, Box } from 'components/Atomic'

import useWindowSize from 'hooks/useWindowSize'

import { TableHeaderGroup } from './TableHeaderGroup'
import { TableRows } from './TableRows'
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
  hasShadow?: boolean
  onRowClick?: (row: TableRowType) => void
}

export const Table = ({
  columns: columnsConfig,
  data,
  sortable,
  loading,
  initialSort,
  hasShadow = true,
  onRowClick,
}: TableProps) => {
  const { isSizeActive, breakpoint } = useWindowSize()
  const sortBy = useMemo(() => initialSort, [initialSort])
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
    columns,
  } = useTable(
    {
      autoResetSortBy: false,
      columns: columnsConfig,
      data,
      disableSortBy: !sortable,
      initialState: { sortBy: initialSort ? sortBy : [] },
    },
    useSortBy,
  )

  const hiddenColumns = useMemo(
    () =>
      columns
        .filter((_, i) => !isSizeActive(columnsConfig[i].minScreenSize))
        .map((column) => column.id),
    [columns, columnsConfig, isSizeActive],
  )

  useEffect(() => {
    setHiddenColumns(hiddenColumns)
  }, [hiddenColumns, setHiddenColumns])

  const { tableProps, bodyProps } = useMemo(
    () => ({ tableProps: getTableProps(), bodyProps: getTableBodyProps() }),
    [getTableBodyProps, getTableProps],
  )

  if (loading) {
    return (
      <Box center className="mt-8">
        <Icon name="refresh" color="primaryBtn" spin size={24} />
      </Box>
    )
  }

  return (
    <table
      {...tableProps}
      className="relative border-separate border-spacing-y-1"
    >
      <thead>
        {headerGroups.map((headerGroup: TableHeaderGroupType) => (
          <TableHeaderGroup
            key={headerGroup.getHeaderGroupProps().key}
            headerGroup={headerGroup}
          />
        ))}
      </thead>

      <tbody {...bodyProps} className={classNames({ 'opacity-30': loading })}>
        <TableRows
          breakpoint={breakpoint}
          rows={rows}
          prepareRow={prepareRow}
          hasShadow={hasShadow}
          onRowClick={onRowClick}
        />
      </tbody>
    </table>
  )
}
