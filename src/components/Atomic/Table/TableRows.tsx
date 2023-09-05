import { TableRow } from 'components/Atomic/Table/TableRow';
import type { TableRowType } from 'components/Atomic/Table/types';
import { memo } from 'react';
import type { Row } from 'react-table';

type Props = {
  rows: Row[];
  prepareRow: (row: Row) => void;
  hasShadow: boolean;
  onRowClick?: (row: TableRowType) => void;
};

export const TableRows = memo(({ rows, prepareRow, hasShadow, onRowClick }: Props) => (
  <>
    {rows.map((row: TableRowType) => {
      prepareRow(row);
      return (
        <TableRow
          hasShadow={hasShadow}
          key={row.getRowProps().key}
          onRowClick={onRowClick}
          row={row}
        />
      );
    })}
  </>
));
