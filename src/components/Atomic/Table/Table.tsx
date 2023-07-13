import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect, useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';

import { TableHeaderGroup } from './TableHeaderGroup';
import { TableRows } from './TableRows';
import {
  InitialTableSort,
  TableColumnsConfig,
  TableData,
  TableHeaderGroupType,
  TableRowType,
} from './types';

export type TableProps = {
  data: TableData[];
  columns: TableColumnsConfig;
  sortable?: boolean;
  loading?: boolean;
  initialSort?: InitialTableSort;
  hasShadow?: boolean;
  onRowClick?: (row: TableRowType) => void;
  stretch?: boolean;
};

export const Table = ({
  columns: columnsConfig,
  data,
  sortable,
  loading,
  initialSort,
  hasShadow = true,
  onRowClick,
  stretch,
}: TableProps) => {
  const { isSizeActive } = useWindowSize();
  const sortBy = useMemo(() => initialSort, [initialSort]);
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
  );

  const hiddenColumns = useMemo(
    () =>
      columns
        .filter((_, i) => !isSizeActive(columnsConfig[i].minScreenSize))
        .map((column) => column.id),
    [columns, columnsConfig, isSizeActive],
  );

  useEffect(() => {
    setHiddenColumns(hiddenColumns);
  }, [hiddenColumns, setHiddenColumns]);

  const { tableProps, bodyProps } = useMemo(
    () => ({ tableProps: getTableProps(), bodyProps: getTableBodyProps() }),
    [getTableBodyProps, getTableProps],
  );

  if (loading) {
    return (
      <Box center className="mt-8">
        <Icon spin color="primaryBtn" name="refresh" size={24} />
      </Box>
    );
  }

  return (
    <table
      {...tableProps}
      className={classNames('relative border-separate border-spacing-y-1', { 'w-full': stretch })}
    >
      <thead>
        {headerGroups.map((headerGroup: TableHeaderGroupType) => (
          <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.getHeaderGroupProps().key} />
        ))}
      </thead>

      <tbody {...bodyProps} className={classNames({ 'opacity-30': loading })}>
        <TableRows
          hasShadow={hasShadow}
          onRowClick={onRowClick}
          prepareRow={prepareRow}
          rows={rows}
        />
      </tbody>
    </table>
  );
};
