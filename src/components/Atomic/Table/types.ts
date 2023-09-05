import type { BreakPoint } from 'hooks/useWindowSize';
import type { Cell, Column, HeaderGroup, Row } from 'react-table';

export type TableData = Record<string, FixMe>;
export type TableColumns = Column<TableData>[];
export type TableColumnsConfig = (Column<TableData> & {
  minScreenSize?: BreakPoint;
})[];
export type TableRowType = Row<TableData>;
export type TableCellType = Cell<TableData, FixMe>;
export type TableHeaderGroupType = HeaderGroup<TableData>;
export type InitialTableSort = {
  id: string;
  desc?: boolean;
}[];

export enum SortType {
  Asc = 'asc',
  Desc = 'desc',
  None = 'none',
}

export const columnAlignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
